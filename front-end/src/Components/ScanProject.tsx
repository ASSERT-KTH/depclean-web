import React from 'react';
import { Col, Button } from 'antd';
import { useAppState } from "src/AppStateContext";
import { useHistory } from 'react-router-dom';
import { reportI, artifactResume } from 'src/interfaces/interfaces'
import { v4 as uuidv4 } from 'uuid';


interface projectProps {
    data: artifactResume
}

export const Project = ({ data }: React.PropsWithChildren<projectProps>) => {

    let history = useHistory();
    const { dispatch } = useAppState();

    const handleClick = async (d: any) => {
        //reset the filters first
        dispatch({ type: "RESET_FILTERS", payload: null })
        //replace the current project for the new one
        dispatch({ type: "LOAD_LOCAL_FILE", payload: data.data });
        //navigate to the view page
        history.push("/result");
    }

    return (
        <Col span="16" className="flex margin-xs boder-round shadow-xs project-scan">
            <div style={{ width: "100%" }}>
                <div className="gal-tittle">
                    <div className="flex flex-base" >
                        <h3>{data.tittle}</h3>
                        <span>{data.version}</span>
                    </div>
                </div>
                <div className="flex description">
                    <Dependencies dataUsed={data.normalReport} dataBloated={data.depcleanRport} key={uuidv4()} />
                    <div className="flex flex-vertical center">
                        <Button
                            className="button btn-green"
                            type="primary"
                            size="large"
                            onClick={() => handleClick(data)}
                        >
                            DepClean Project
                            </Button>
                    </div>
                </div>
            </div>
        </Col>
    );
}

interface dependenciesProps {
    dataUsed: reportI
    dataBloated: reportI
}

const Dependencies = ({ dataUsed, dataBloated }: React.PropsWithChildren<dependenciesProps>) => {

    return (
        <div key={uuidv4()} className="width-90">
            <table className="table-report">
                <thead>
                    <tr>
                        <th>Dependencies</th>
                        <th>Direct</th>
                        <th>Transitive</th>
                        <th>Inherited</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td>Used</td>
                        <td>{dataUsed.direct}</td>
                        <td>{dataUsed.transitive}</td>
                        <td>{dataUsed.inherited}</td>
                    </tr>
                    <tr>
                        <td>Bloated</td>
                        <td className="highlight-red">{dataBloated.direct}</td>
                        <td className="highlight-red">{dataBloated.transitive}</td>
                        <td className="highlight-red">{dataBloated.inherited}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}