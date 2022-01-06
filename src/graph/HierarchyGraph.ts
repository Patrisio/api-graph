import {rootNodeName, paths, requestBodySelector, responsesSelector, parametersSelector} from './paths';
import {NODE_SIZE, COLORS, METHODS} from './constants';
import {get} from 'lodash';

export default class HierarchyGraph {
    static components: any;

    public static generateSchema(data: any) {
        console.log(data);
        this.components = data.components;

        const rootNode: any = {
            name: rootNodeName(data),
            value: NODE_SIZE,
            ...COLORS.rootNode,
            children: [],
        };

        for (let entry of Object.entries(paths(data))) {
            const path = entry[0];
            if (path === '/mobile-log') {
                console.log(path);
            }
            rootNode.children.unshift({
                name: path,
                value: NODE_SIZE,
                ...COLORS.pathNode,
                children: [],
            });
            const pathData = entry[1];
            const {
                extractedData: {
                    requestBody,
                    responses,
                    parameters, 
                },
                entityName,
            }: any = this.getDependenciesByPath(pathData);

            const deps = [
                {
                    name: entityName.requestBody,
                    list: requestBody,
                    color: COLORS.requestBodyNode,
                },
                {
                    name: entityName.responses,
                    // Может приходить как [{paging}, {data}], так и [{data}]. В случае если приходит только data, то не отображаем его в графе
                    list: responses.length > 1 ? responses : responses[0].children,
                    color: COLORS.responsesNode,
                },
                {
                    name: 'parameters',
                    list: parameters,
                    color: COLORS.parametersNode,
                },
            ];
            console.log(deps, '__RRRRRR__');
            for (let dep of deps) {
                const options = {
                    name: dep.name,
                    value: NODE_SIZE,
                    ...dep.color,
                };
                if (!dep.list.length) continue;
                if (dep.name === 'responses') {
                    console.log(rootNode.children[0], 'rootNode.children[0]');

                }
                rootNode.children[0].children.push({
                    ...options,
                    ...this.getGraphChildrenNodes(dep.list, {
                        ...options,
                        ...(
                            dep.name === 'parameters' ?
                                COLORS.parametersNode :
                                COLORS.schemaNode
                            ),
                    }),
                });
            }
        }
        console.log(rootNode, '__rootNode__');

        return rootNode;
    }

    static getGraphChildrenNodes(dep: any, options: any) {
        console.log(dep, 'DEP');
        for (let [i, depItem] of dep.entries()) {
            depItem = {
                ...options,
                ...depItem,
            };
            dep[i] = depItem;

            const children = depItem.children;
            if (children?.length > 0) {
                this.getGraphChildrenNodes(children, options);
            }
        }

        return { children: dep };
    }

    static getDependenciesByPath(pathData: any) {
        console.log(pathData);
        const {POST, GET} = METHODS;

        switch (Object.keys(pathData)[0]) {
            case POST:
                return this.extractDataByMethod(pathData, POST);
            case GET:
                return this.extractDataByMethod(pathData, GET);
            default: 
                return;
        }
    }

    static extractDataByMethod(pathData: any, method: METHODS) {
        const requestBodyRef = requestBodySelector(pathData, method);
        const requestBodyDeps = this.extractDataByRef(requestBodyRef);
        const requestBodyEntityName = this.extractEntityName(requestBodyRef);

        const responsesRef = responsesSelector(pathData, method);
        const responsesDeps = this.extractDataByRef(responsesRef);
        const responsesEntityName = this.extractEntityName(responsesRef);

        const parametersRefsList = parametersSelector(pathData, method);
        const parametersDepsList = [];
        if (parametersRefsList) {
            for (let {$ref: ref} of parametersRefsList) {
                const parametersDeps = this.extractDataByRef(ref)
                parametersDepsList.push(parametersDeps);
            }
        }
        console.log(responsesDeps, 'responsesDeps');
        const {
            requestBodyDepsParameters,
            responsesDepsParameters,
        } = this.extractParameters({
            requestBodyDeps,
            responsesDeps,
            parametersDepsList,
        });
        const extractedData = {
            requestBody: requestBodyDepsParameters,
            responses: responsesDepsParameters,
            parameters: parametersDepsList,
        };

        return {
            extractedData,
            entityName: {
                requestBody: requestBodyEntityName,
                responses: responsesEntityName,
            },
        };
    }

    static extractDataByRef(ref: string) {
        if (!ref) return null;
        
        const requestBodyRef =
            ref
                .split('/')
                .slice(2)
                .join('.');
        const requestBodyDeps = get(this.components, requestBodyRef, null);
        return requestBodyDeps;
    }

    static extractOtherDeps(propertyContent: any, propertyName: string, ref: any) {
        if (propertyContent.$ref) {
            const entityContent = this.extractDataByRef(propertyContent.$ref);

            if (entityContent?.properties) {
                const propsEntities = Object.entries(entityContent.properties);

                for (let [propsName, propsContent] of propsEntities) {
                    const propertyData = (propsContent as any).items || propsContent;

                    ref.unshift({
                        name: propsName,
                        children: [],
                    });

                    this.extractOtherDeps(propertyData, propsName, ref[0].children);
                }
            }
        }
    }

    static extractParameters({
        requestBodyDeps,
        responsesDeps,
        parametersDepsList,
    }: any) {
        const propertiesRequestBodyRefsList = [];
        if (requestBodyDeps?.properties) {
            const propertiesRequestBody = Object.entries(requestBodyDeps.properties);
            
            for (let [propsName, propsContent] of propertiesRequestBody) {
                const propertyData = (propsContent as any).items || propsContent;
                let ref = {
                    name: propsName,
                    children: [],
                };

                this.extractOtherDeps(propertyData, propsName, ref.children);
                propertiesRequestBodyRefsList.push(ref);
            }
        }

        const propertiesResponsesDepsRefsList: any = [];
        if (responsesDeps.properties) {
            const propertiesResponsesDeps = Object.entries(responsesDeps.properties);

            for (let [propsName, propsContent] of propertiesResponsesDeps) {
                const propertyData = (propsContent as any).items || propsContent;
                let ref = {
                    name: propsName,
                    children: [],
                };

                this.extractOtherDeps(propertyData, propsName, ref.children);
                propertiesResponsesDepsRefsList.push(ref);
            }
        } else {
            const universalResponseEntityContent = this.extractDataByRef(responsesDeps.allOf[0].$ref);
            const propertiesResponsesDeps = Object.entries(universalResponseEntityContent.properties);

            for (let [propsName, propsContent] of propertiesResponsesDeps) {
                const propertyData = (propsContent as any).items || propsContent;
                let ref = {
                    name: propsName,
                    children: [],
                };

                this.extractOtherDeps(propertyData, propsName, ref.children);
                propertiesResponsesDepsRefsList.push(ref);
            }
        }

        return {
            requestBodyDepsParameters: propertiesRequestBodyRefsList,
            responsesDepsParameters: propertiesResponsesDepsRefsList,
        };
    }

    static extractEntityName(ref: string) {
        if (!ref) return null;

        const requestBodyRefArray = ref.split('/');
        const entityName = requestBodyRefArray[requestBodyRefArray.length - 1];
        return entityName;
    }
}