export default () => {
    return (
        <button
            style={{
                backgroundColor: "#1a191c",
                border: "0",
                borderRadius: "0",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                width: "120px",
                height: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
            }}
            className="install-badge"
            onClick={async () => {
                const s = new URLSearchParams(location.search);
                if (!window.ws) window.ws = new WebSocket("ws:localhost:1842");

                const e = `velocity:install-addon:${s.get("url")}:${s.get("name")}`;

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
