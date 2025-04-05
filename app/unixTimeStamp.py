from datetime import datetime
from sqlalchemy import TypeDecorator, Integer
# UnixTimestampMillis osztály, amely a Unix timestamp-et milliszekundum pontossággal tárolja
class UnixTimestampMillis(TypeDecorator):
    impl = Integer 
    def process_result_value(self, value, dialect):
        if value is not None:
            return datetime.fromtimestamp(value / 1000)# Unix timestamp millis -> datetime
        return None