
import React from 'react';
import { useAppState } from "./AppStateContext"
import { getGeneralReport, getDeletedDirectReport, getAllDeletedReport, filterEmpty } from 'src/utils/message';
import { DataGroup } from 'src/DataGroup';
import { v4 as uuidv4 } from 'uuid';
// import { ArrowRightOutlined } from '@ant-design/icons';

export const Message = () => {
    //get the main state
    const { state } = useAppState();
    //Get all the nodes
    const { messageState, filteredProject, project } = state;

    //GET THE INFORMATIN
    const currentProject = messageState === "ORIGINAL" ? project : filteredProject;
    const generalReport: any = getGeneralReport(currentProject);
    const bloatMessage: any = messageState === "DEBLOAT_DIRECT" ?
        getDeletedDirectReport(filteredProject) :
        messageState === "DEBLOAT_ALL" ?
            getAllDeletedReport(filteredProject) :
            <></>;

    const message = messageState === "ORIGINAL" ? <></> :
        <div className={"flex flex-wrap pull-left"} key={uuidv4()}>
            {/* <div className="flex text-message">
                <div>If you<br></br>delete<ArrowRightOutlined /></div>
            </div> */}
            <DataGroup
                key={uuidv4()}
                tittle={bloatMessage.deleted.title}
                dataInfo={[bloatMessage.deleted.direct, bloatMessage.deleted.transitive]}
                theme="bloated" />
            <DataGroup
                key={uuidv4()}
                tittle="Size"
                dataInfo={[bloatMessage.deleted.size.totalSize]}
                theme="bloated" />
            {/* <div className="flex text-message">
                <div>Now this<br></br>project has<ArrowRightOutlined /></div>
            </div> */}
        </div>


    //REFACTOR 
    //CREATE A MESSAGE   
    //message should contain how much you delete

    const dependencies = [generalReport.dependencies.direct, generalReport.dependencies.inherited, generalReport.dependencies.transitive]
        .filter(filterEmpty);
    const bloated = [generalReport.bloated.direct, generalReport.bloated.inherited, generalReport.bloated.transitive]
        .filter(filterEmpty);
    const totalSize = [generalReport.size.totalSize];
    const totalDependencies = generalReport.totalDependencies;

    return (
        <div className="flex flex-wrap margin-buttom-20 " key={uuidv4()}>
            <DataGroup
                key={uuidv4()}
                tittle={totalDependencies.title}
                dataInfo={[totalDependencies.totalDependencies]}
                theme="dependencies"
            />
            <DataGroup
                key={uuidv4()}
                tittle={generalReport.size.title}
                dataInfo={totalSize}
                theme="dependencies"
            />
            <DataGroup
                key={uuidv4()}
                tittle={generalReport.dependencies.title}
                dataInfo={dependencies}
                theme="dependencies"
            />
            <DataGroup
                key={uuidv4()}
                tittle={generalReport.bloated.title}
                dataInfo={bloated}
                theme="bloated"
            />
            {message}
        </div>
    )
}



