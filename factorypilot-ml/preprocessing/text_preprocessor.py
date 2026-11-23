"""Text preprocessing and industrial safety vocabulary normalization."""

from __future__ import annotations

import re
import string
from typing import List, Optional

# Common industrial safety acronyms and canonical expansions
INDUSTRIAL_ACRONYMS = {
    "loto": "lockout tagout isolation",
    "ppe": "personal protective equipment",
    "hmi": "human machine interface terminal",
    "e-stop": "emergency stop switch button",
    "estop": "emergency stop switch button",
    "gfi": "ground fault circuit interrupter",
    "gfci": "ground fault circuit interrupter",
    "osha": "occupational safety health administration",
    "hvac": "heating ventilation air conditioning",
    "ptw": "permit to work authorized clearance",
    "cnc": "computer numerical control machine",
    "kwh": "kilowatt hour energy",
    "rpm": "revolutions per minute rotational speed",
    "psi": "pounds per square inch pressure",
    "ehs": "environmental health and safety",
    "msds": "material safety data sheet",
    "sds": "safety data sheet",
    "capa": "corrective and preventive action",
    "trir": "total recordable incident rate"
}

STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but",
    "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from",
    "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him",
    "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "me", "more",
    "most", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other",
    "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "should", "so",
    "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then",
    "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up",
    "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom",
    "why", "with", "would", "you", "your", "yours", "yourself", "yourselves"
}


class IndustrialTextPreprocessor:
    """Preprocesses and normalizes industrial safety text narratives."""

    def __init__(
        self,
        expand_acronyms: bool = True,
        remove_stopwords: bool = True,
        lowercase: bool = True
    ):
        self.expand_acronyms = expand_acronyms
        self.remove_stopwords = remove_stopwords
        self.lowercase = lowercase

    def clean_text(self, text: str) -> str:
        """Clean and normalize a single text string."""
        if not isinstance(text, str) or not text.strip():
            return ""

        if self.lowercase:
            text = text.lower()

        # Expand hyphenated words like E-Stop
        text = re.sub(r"\be-stop\b", "emergency stop", text, flags=re.IGNORECASE)

        # Remove punctuation except alphanumeric characters and spaces
        text = re.sub(r"[^\w\s]", " ", text)

        tokens = text.split()

        processed_tokens: List[str] = []
        for t in tokens:
            # Acronym expansion
            if self.expand_acronyms and t in INDUSTRIAL_ACRONYMS:
                processed_tokens.extend(INDUSTRIAL_ACRONYMS[t].split())
            elif self.remove_stopwords and t in STOPWORDS:
                continue
            elif len(t) > 1:
                processed_tokens.append(t)

        return " ".join(processed_tokens)

    def transform(self, texts: List[str]) -> List[str]:
        """Transform a list of texts."""
        return [self.clean_text(t) for t in texts]


def preprocess_safety_text(text: str) -> str:
    """Convenience function for quick preprocessing."""
    preprocessor = IndustrialTextPreprocessor()
    return preprocessor.clean_text(text)

