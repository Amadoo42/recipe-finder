from typing import Any, Optional
from dataclasses import dataclass, asdict

@dataclass
class Message:
    success: bool
    description: str
    data: Optional[Any] = None

    def to_dict(self):
        return asdict(self)