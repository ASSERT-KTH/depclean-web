import React from 'react';
import { v4 as uuidv4 } from 'uuid';

interface LinkProps {
    data: any[],
    linkAccesor(d: any): string,
}

export const Links = ({
    data,
    linkAccesor
}: React.PropsWithChildren<LinkProps>) => {

    const classAccessor = (d: any) => {
        return "treeLink " +
            (d.data.highlight || d.parent.data.highlight ? " treeLink-highlight" : "") +
            (d.data.visible ? " treeLink-visible" : " treeLink-invisible");
    }

    return (
        <g
            className="treeLinks"
            key={uuidv4()}
        >
            {data.map((d, i) => (
                <path
                    d={linkAccesor(d)}
                    className={classAccessor(d)}
                    // strokeDasharray="5,5"
                    key={uuidv4()}
                />
            ))}

        </g>
    )
}