import React, { useState, useEffect } from 'react';
import { Row, Col, message, Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import Dropzone from 'react-dropzone';



export const Scan = () => {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    useEffect(() => {
        function handleResize() {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
        window.addEventListener('resize', handleResize)
    })

    const handleDropAccepted = ([file]: [any]) => {
        console.log("file", file)
        const reader: FileReader = new FileReader()
        reader.onload = () => {
            try {
                const json = JSON.parse(reader.result as string)
                console.log("in the try", json)

                //try to parse if not send message

                // const packages = Object.keys(json.dependencies)
                // console.log(packages)
                //   .filter(packageName => {
                //     const versionRange = json.dependencies[packageName]
                //     return semver.valid(versionRange) || semver.validRange(versionRange)
                //   })
                //   .map(packageName => {
                //     const versionRange = json.dependencies[packageName]

                //     return {
                //       name: packageName,
                //       versionRange,
                //       resolvedVersion: this.resolveVersionFromRange(versionRange),
                //     }
                //   })

                // this.setState({ packages }, this.setSelectedPackages)


            } catch (err) {
                handleDropRejected();
                console.error(err)
            }
        }

        try {
            reader.readAsBinaryString(file)
        } catch (err) {
            console.error(err)
            handleDropRejected();
        }
    }

    const handleDropRejected = () => {
        message.error(`Could not parse the depclean POM.json file`);
    }


    return (
        <Row id="search"
            key={uuidv4()}
            style={{ width: size.width, height: size.height, backgroundColor: "white" }}
            justify="center"
            align="middle"

        >
            <Col span={12} >
                <div>
                    <Dropzone
                        className="scan__dropzone"
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
        </Row>
    )
}