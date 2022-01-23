import React, {isValidElement} from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {isBoolean, isArray} from 'lodash';

type DepsTreeProps = {
    data: any,
};

export default function DepsTree({
    data,
}: DepsTreeProps) {
    const TreeViewUI = ({children}: any) => {
        return (
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            >
                {children}
            </TreeView>
        );
    };

    const depDescription = (depPropsList: any[]) => {
        return depPropsList.map(({id, name, value}) => {
            return value && value !== 'undefined' &&
                <Box
                    key={id}
                    component='div'
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    {
                        isArray(value) ?
                        value :
                        <>
                            <TreeItem
                                key={id}
                                nodeId={id}
                                label={name}
                            />
                            <Typography
                                variant="body2"
                                gutterBottom
                                sx={{ marginBottom: '0' }}
                            >
                                {value}
                            </Typography>
                        </>
                    }
                </Box>;
        })
    };

    const getFormattedPropValue = (propName: string, propValue: any) => {
        const getRequiredPropValue = (propValue: any) => {
            if (isBoolean(propValue)) {
                return `${propValue}`;
            }

            if (isArray(propValue)) {
                return propValue.map((name: string) => (
                    <TreeItem
                        key={name}
                        nodeId={name}
                        label={name}
                    />
                ));
            }
        };

        switch (propName) {
            case 'maxItems':
            case 'type':
            case 'description':
                return propValue;
            case 'required':
                return getRequiredPropValue(propValue);
            case 'additionalProperties':
                return `${propValue}`;
            default:
                return null;
        }
    };

    const hasValidReactElement = (elementsList: any) => {
        let hasValidReactElement = false;

        for (let element of elementsList) {
            if (isValidElement(element)) {
                hasValidReactElement = true;
                break;
            }
        }
        console.log(hasValidReactElement, 'hasValidReactElement');
        return hasValidReactElement;
    };

    const renderTreeItems = (deps: any): any[] => {
        const treeItemsList: any[] = [];

        if (!(deps?.length > 0)) return treeItemsList;

        for (let {
            id, name, maxItems, typeData, required,
            description, additionalProperties, children,
        } of deps) {
            const depPropsList = [
                {
                    id: `${id}-1`,
                    name: 'maxItems:',
                    value: getFormattedPropValue('maxItems', maxItems),
                },
                {
                    id: `${id}-2`,
                    name: 'required:',
                    value: getFormattedPropValue('required', required),
                },
                {
                    id: `${id}-3`,
                    name: 'type:',
                    value: getFormattedPropValue('type', typeData),
                },
                {
                    id: `${id}-4`,
                    name: 'description:',
                    value: getFormattedPropValue('description', description),
                },
                {
                    id: `${id}-5`,
                    name: 'additionalProperties:',
                    value: getFormattedPropValue('additionalProperties', additionalProperties),
                },
            ];

            const descriptionPropList = depDescription(depPropsList);
            console.log(descriptionPropList, 'descriptionPropList');

            hasValidReactElement(descriptionPropList) ?
                treeItemsList.push(
                    <TreeItem key={id} nodeId={id} label={name}>
                        {renderTreeItems(children)}
                        {descriptionPropList}
                    </TreeItem>
                ) :
                treeItemsList.push(
                    <TreeItem key={id} nodeId={id} label={name}>
                        {renderTreeItems(children)}
                    </TreeItem>
                );
        }
        
        return treeItemsList;
    };

    const renderTreeView = (deps: any) => {
        const { name, children, id, maxItems, typeData, required } = deps;
        console.log(deps, '__DEEEEEPS__');
        return (
            <TreeViewUI>
                {renderTreeItems(children)}
            </TreeViewUI>
        )
    };

    return renderTreeView(data);
};