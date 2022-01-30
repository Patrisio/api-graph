import React, {isValidElement, memo} from 'react';
import DepsTreeView from '../views/DepsTreeView';
import TreeItem from '@mui/lab/TreeItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {isBoolean, isArray} from 'lodash';

type DepsTreeContainerType = {
    deps: any,
    isVisibleDepsTree: boolean,
};

const areEqualProps = (prev: any, next: any) =>
    prev.isVisibleDepsTree === next.isVisibleDepsTree;

export const DepsTreeContainer = memo(({
    deps,
    isVisibleDepsTree
}: DepsTreeContainerType) => {
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
                                variant='body2'
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

    return (
        isVisibleDepsTree ?
        <DepsTreeView>
            {renderTreeItems(deps)}
        </DepsTreeView> : null
    );
}, areEqualProps)