import React, {useState, ChangeEvent} from 'react';
import DepsTreeContainer from '../containers/DepsTreeContainer';
import { isNumber } from 'lodash';
import SidebarContentView from '../views/SidebarContentView';

type SidebarContentProps = {
    foundEntitiesCount: number | null,
    prevHighlightedNodes: any,
    currentPointerIndex: number | null,
    movePointer: VoidFunction,
    resetNodesHighlight: VoidFunction,
    handleGraph: (entityName: string) => void,
    resetGraph: VoidFunction,
};

let prevEntityName: string;

export default function SidebarContentContainer({
    foundEntitiesCount,
    prevHighlightedNodes,
    currentPointerIndex,
    movePointer,
    resetNodesHighlight,
    handleGraph,
    resetGraph,
}: SidebarContentProps) {
    const [nodeName, setNodeName] = useState<string>('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNodeName(event.target.value);
    };

    const getCurrentPointerIndex = () => {
        if (currentPointerIndex !== null) {
            return currentPointerIndex + 1;
        }
    };

    const highlightGraphLinksByNodeName = (e: any) => {
        if (e.key !== 'Enter') return;

        e.preventDefault();
        const entityName = e.target.value;
        
        if (entityName === '') {
            setNodeName('');
            resetGraph();
            return;
        }

        if (prevEntityName === entityName) {
            movePointer();
            return;
        }

        if (prevHighlightedNodes.length !== 0) {
            resetNodesHighlight();
        }
        
        handleGraph(entityName);
        prevEntityName = entityName;
    }

    const getCoincidenceNoticeText = () => {
        return foundEntitiesCount as number > 0 ?
            `Найдено ${foundEntitiesCount} совпадений (${getCurrentPointerIndex()}/${foundEntitiesCount})` :
            'Cовпадений не найдено';
    };

    const DepsTreeUI = () => {
        const isVisibleDepsTree = prevHighlightedNodes.length > 0 && isNumber(currentPointerIndex);
        const depsTreeData= prevHighlightedNodes[currentPointerIndex as number]?.children;

        return (
            isVisibleDepsTree ?
            <DepsTreeContainer
               deps={depsTreeData}
            /> : null
        );
    };

    return (
        <SidebarContentView
            nodeName={nodeName}
            isDisabledResetButton={prevHighlightedNodes.length === 0}
            depsTreeUI={<DepsTreeUI />}
            isVisibleCoincidenceNotice={foundEntitiesCount !== null}
            coincidenceNoticeText={getCoincidenceNoticeText()}
            highlightGraphLinksByNodeName={highlightGraphLinksByNodeName}
            handleChange={handleChange}
            resetGraph={() => {
                setNodeName('');
                resetGraph();
            }}
        />
    );
}