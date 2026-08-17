// Test SMTP connection from local machine to see what happens
// Run: node scripts/test-smtp.mjs
import tls from "tls";
import net from "net";

const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 587;
const SMTP_USER = "mahendranpradhikshalini@gmail.com";
const SMTP_PASS = "rkezrecuoxeoljjy";
const TEST_TO = "mahendranpradhikshalini@gmail.com";

console.log("Testing SMTP connection to Gmail port 587...");

let buffer = "";
let step = 0;
let plainSocket = null;
let tlsSocket = null;

const send = (line) => {
  const sock = tlsSocket || plainSocket;
  console.log(`→ [step ${step}] ${line}`);
  sock.write(line + "\r\n");
};

const processLine = (line) => {
  const code = line.substring(0, 3);
  const isLast = line[3] === " ";
  console.log(`← [step ${step}] ${line}`);

  if (step === 0 && code === "220") {
    step = 1; send("EHLO localhost");
  } else if (step === 1 && code === "250" && isLast) {
    step = 2; send("STARTTLS");
  } else if (step === 2 && code === "220") {
    step = 3;
    tlsSocket = tls.connect({ socket: plainSocket, host: SMTP_HOST, servername: SMTP_HOST });
    tlsSocket.setEncoding("utf8");
    tlsSocket.on("data", onData);
    tlsSocket.on("error", e => console.error("TLS error:", e.message));
    tlsSocket.on("secureConnect", () => { step = 3.5; send("EHLO localhost"); });
  } else if (step === 3.5 && code === "250" && isLast) {
    step = 4; send("AUTH LOGIN");
  } else if (step === 4 && code === "334") {
    step = 5; send(Buffer.from(SMTP_USER).toString("base64"));
  } else if (step === 5 && code === "334") {
    step = 6; send(Buffer.from(SMTP_PASS).toString("base64"));
  } else if ((step === 5 || step === 6) && code === "235") {
    step = 7; send(`MAIL FROM:<${SMTP_USER}>`);
  } else if (step === 7 && code === "250") {
    step = 8; send(`RCPT TO:<${TEST_TO}>`);
  } else if (step === 8 && code === "250") {
    step = 9; send("DATA");
  } else if (step === 9 && code === "354") {
    step = 10;
    const msg = [
      `From: "Ceylon Curry" <${SMTP_USER}>`,
      `To: <${TEST_TO}>`,
      `Subject: TEST - Ceylon Curry Email Working`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      ``,
      `<h1>✅ Email Working!</h1><p>This is a test from Ceylon Curry local.</p>`,
      `.`,
      ``
    ].join("\r\n");
    (tlsSocket || plainSocket).write(msg);
  } else if (step === 10 && code === "250") {
    console.log("✅ EMAIL SENT SUCCESSFULLY!");
    send("QUIT");
    process.exit(0);
  } else if (["421","450","451","500","501","502","503","535","550"].includes(code)) {
    console.error(`❌ SMTP ERROR ${code}: ${line}`);
    process.exit(1);
  }
};

const onData = (chunk) => {
  buffer += chunk;
  let idx;
  while ((idx = buffer.indexOf("\r\n")) !== -1) {
    const line = buffer.slice(0, idx);
    buffer = buffer.slice(idx + 2);
    if (line.trim()) processLine(line);
  }
};

plainSocket = net.connect({ host: SMTP_HOST, port: SMTP_PORT });
plainSocket.setEncoding("utf8");
plainSocket.on("data", onData);
plainSocket.on("error", e => { console.error("Socket error:", e.message); process.exit(1); });
plainSocket.on("timeout", () => { console.error("Timeout!"); process.exit(1); });
plainSocket.setTimeout(30000);
