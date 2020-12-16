import React, { useState, useEffect } from 'react';

interface StatusMessageProps {
    statusMessages: String[],
    errorMessage: String,
    status: "loading" | "error"
}

export const StatusMessage = ({
    statusMessages,
    errorMessage,
    status

}: React.PropsWithChildren<StatusMessageProps>) => {
    const [pos, setPos] = useState(0);
    const [message, setMessage] = useState(statusMessages[pos])
    useEffect(() => {
        const interval = setInterval(function () {
            setPos(pos + 1);
            setMessage(statusMessages[pos % statusMessages.length])
        }, 5000);
        return () => clearInterval(interval);
    }, [pos, statusMessages]);

    const displayMessage = status === "loading" ? message : errorMessage;
    return <div className={"message " + (status === "loading" ? "message-loading" : "message-error")}>{displayMessage}</div>
}