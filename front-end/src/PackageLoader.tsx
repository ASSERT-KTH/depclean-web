import React from 'react';
import { Col, Button } from 'antd';
import Dropzone from 'react-dropzone';
import { InboxOutlined } from '@ant-design/icons';

interface packageLoaderProps {
    handleDropAccepted: any,
    handleDropRejected: any,
}

export const PackageLoader = ({ handleDropAccepted, handleDropRejected }: React.PropsWithChildren<packageLoaderProps>) => {

    return <Col span={12} >
        <div>
            <Dropzone
                // className="scan__dropzone"
                onDropAccepted={handleDropAccepted}
                onDropRejected={handleDropRejected}
                multiple={false}
                accept="application/json"
            // onDrop={(acceptedFiles: any) => console.log(acceptedFiles)}
            >
                {({ getRootProps, getInputProps }: any) => (
                    <section className="">
                        <div {...getRootProps()} className="dropzone flex flex-list flex-center">
                            <input {...getInputProps()} />
                            <InboxOutlined className="icon-large" />
                            <p>Drag 'n' drop a file here </p>
                            <p>OR</p>
                            <Button type="primary" className="button btn-green" size={'large'}>
                                click to upload file
                </Button>

                        </div>
                    </section>
                )}
            </Dropzone>
        </div>
    </Col>
}