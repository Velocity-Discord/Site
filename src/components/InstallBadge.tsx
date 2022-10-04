import "../styles/InstallBadge.css";

export default (props: any) => {
    return (
        <button
            className="install-badge"
            onClick={async () => {
                if (!window.ws) window.ws = new WebSocket("ws:localhost:1842");

                const e = `velocity:install-addon:${new URLSearchParams(location.search).get("url")}`;

                while (window.ws.readyState === 0) {
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }

                window.ws.send(e);
            }}
        >
            Install Addon
        </button>
    );
};
