import "../styles/Button.css";
import { useState } from "react";

declare global {
    interface Window {
        ws: any;
    }
}

export default (props: any) => {
    const { label, color = "brand", href = "#", size = "small", actionType } = props;

    const [content, setContent] = useState(label);
    const [_color, setColor] = useState(color);

    return (
        <a
            href={href}
            className={`button color-${_color} size-${size}`}
            onClick={async () => {
                if (!window.ws) window.ws = new WebSocket("ws:localhost:1842");

                switch (actionType) {
                    case "install-addon":
                        const e = `velocity:install-addon:${props.actionProps}`;

                        while (window.ws.readyState === 0) {
                            await new Promise((resolve) => setTimeout(resolve, 100));
                        }

                        window.ws.onerror = () => {
                            setContent("Error Installing Addon");
                            setColor("danger");
                        };

                        window.ws.send(e);
                        setContent("Success!");
                        setColor("success");

                        break;
                }
            }}
        >
            {content}
        </a>
    );
};
