import React from 'react';
import { List } from 'antd';


export const LateralMenu = () => {
    const data = [
        {
            label: 'Overview',
            url: "#MainInfo"
        },
        {
            label: 'Dependency Tree',
            url: "#DependencyTree"
        },
        {
            label: 'Dependency provenance',
            url: "#dependenceProvency"
        },


    ];

    return (
        <List
            bordered
            dataSource={data}
            renderItem={item => (
                <List.Item>
                    <a href={item.url}>{item.label}</a>
                </List.Item>
            )}
        />
    )
}
