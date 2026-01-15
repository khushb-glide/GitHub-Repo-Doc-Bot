from pathlib import Path
from typing import List, Dict

from backend.config import CHUNK_SIZE, CHUNK_OVERLAP
from backend.infra.llm import embed_text


def blind_chunk(text: str) -> List[str]:
    chunks = []
    start = 0
    length = len(text)

    while start < length:
        end = start + CHUNK_SIZE
        chunks.append(text[start:end])
        start = end - CHUNK_OVERLAP
        if start < 0:
            start = 0

    return chunks


def embed_file(file_path: Path) -> List[Dict]:
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return []

    chunks = blind_chunk(content)
    embedded_chunks = []

    for i, chunk in enumerate(chunks):
        embedding = embed_text(chunk)
        embedded_chunks.append({
            "content": chunk,
            "embedding": embedding,
            "file_path": str(file_path),
            "chunk_index": i
        })

    return embedded_chunks
