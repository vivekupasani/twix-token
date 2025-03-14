const express = require("express");
const cors = require("cors");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Load Agora credentials from environment variables
const AGORA_APP_ID = process.env.AGORA_APP_ID
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE

// Generate Token API
app.get("/generate-token", (req, res) => {
    const { channelName, uid, account, role } = req.query;

    if (!channelName || (!uid && !account)) {
        return res.status(400).json({ error: "Missing channelName, uid, or account" });
    }

    const agoraRole = role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const expirationTimeInSeconds = 3600; // Token valid for 1 hour

    let token;
    if (uid) {
        token = RtcTokenBuilder.buildTokenWithUid(
            AGORA_APP_ID,
            AGORA_APP_CERTIFICATE,
            channelName,
            parseInt(uid),
            agoraRole,
            expirationTimeInSeconds
        );
    } else {
        token = RtcTokenBuilder.buildTokenWithAccount(
            AGORA_APP_ID,
            AGORA_APP_CERTIFICATE,
            channelName,
            account,
            agoraRole,
            expirationTimeInSeconds
        );
    }

    return res.json({
        appId: AGORA_APP_ID,
        channelName,
        token,
        role,
    });
});

app.get('/' , (req, res) => {
    res.send('Hello, Agora Token API!')
})

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Agora Token API running at http://localhost:${PORT}`);
});
