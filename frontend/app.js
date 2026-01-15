const ingestBtn = document.getElementById("ingest-btn");
const repoInput = document.getElementById("repo-url");
const ingestStatus = document.getElementById("ingest-status");

const useExistingBtn = document.getElementById("use-existing-btn");

const ingestSection = document.getElementById("ingest-section");
const chatSection = document.getElementById("chat-section");

const chatBox = document.getElementById("chat-box");
const questionInput = document.getElementById("question-input");
const sendBtn = document.getElementById("send-btn");

const ingestSpinner = document.getElementById("ingest-spinner");
const chatSpinner = document.getElementById("chat-spinner");

function showChat() {
    ingestSection.style.display = "none";
    chatSection.style.display = "flex";
}

function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);

    const span = document.createElement("span");
    span.textContent = text;

    messageDiv.appendChild(span);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

ingestBtn.addEventListener("click", async () => {
    const repoUrl = repoInput.value.trim();
    if (!repoUrl) {
        ingestStatus.textContent = "Please enter a repository URL.";
        return;
    }

    ingestStatus.textContent = "Ingesting repository…";
    ingestBtn.disabled = true;
    useExistingBtn.disabled = true;
    ingestSpinner.classList.remove("hidden");

    try {
        const response = await fetch("/ingest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ repo_url: repoUrl })
        });

        if (!response.ok) {
            throw new Error("Ingestion failed");
        }

        showChat();

    } catch {
        ingestStatus.textContent = "Error during ingestion.";
        ingestBtn.disabled = false;
        useExistingBtn.disabled = false;
    } finally {
        ingestSpinner.classList.add("hidden");
    }
});

useExistingBtn.addEventListener("click", async () => {
    ingestStatus.textContent = "";
    ingestBtn.disabled = true;
    useExistingBtn.disabled = true;
    ingestSpinner.classList.remove("hidden");

    try {
        const response = await fetch("/has_index");
        if (!response.ok) {
            throw new Error();
        }

        const data = await response.json();

        if (!data.has_index) {
            ingestStatus.textContent = "No existing index found. Please ingest a repo first.";
            ingestBtn.disabled = false;
            useExistingBtn.disabled = false;
            return;
        }

        showChat();

    } catch {
        ingestStatus.textContent = "Error checking existing index.";
        ingestBtn.disabled = false;
        useExistingBtn.disabled = false;
    } finally {
        ingestSpinner.classList.add("hidden");
    }
});

sendBtn.addEventListener("click", sendQuestion);
questionInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendQuestion();
});

async function sendQuestion() {
    const question = questionInput.value.trim();
    if (!question) return;

    addMessage(question, "user");
    questionInput.value = "";

    sendBtn.disabled = true;
    chatSpinner.classList.remove("hidden");

    try {
        const response = await fetch("/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question })
        });

        if (!response.ok) {
            throw new Error();
        }

        const data = await response.json();
        addMessage(data.answer, "bot");

    } catch {
        addMessage("Error getting response from server.", "bot");
    } finally {
        chatSpinner.classList.add("hidden");
        sendBtn.disabled = false;
    }
}
