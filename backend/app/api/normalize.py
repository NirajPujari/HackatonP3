from fastapi import APIRouter, HTTPException
from app.services.normalize import normalize_doc
from app.db import get_db
from pymongo.errors import PyMongoError

router = APIRouter()


@router.post("/")
def normalize_data():
    try:
        db = get_db()

        raw_collection = db["raw_data"]
        target_collection = db["data"]
        
        try:
            delete_result = target_collection.delete_many({})
        except PyMongoError as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to clear target collection: {str(e)}"
            )

        raw_cursor = raw_collection.find()

        clean_data = []
        skipped = 0

        for doc in raw_cursor:
            try:
                normalized = normalize_doc(doc)
                if normalized:
                    clean_data.append(normalized)
                else:
                    skipped += 1
            except Exception:
                skipped += 1

        if not clean_data:
            return {
                "message": "No valid data found",
                "deleted": delete_result.deleted_count,
                "inserted": 0,
                "skipped": skipped,
            }

        try:
            result = target_collection.insert_many(clean_data)
        except PyMongoError as e:
            raise HTTPException(status_code=500, detail=f"DB insert failed: {str(e)}")

        return {
            "message": "Normalization complete",
            "deleted": delete_result.deleted_count,
            "inserted": len(result.inserted_ids),
            "skipped": skipped,
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
        db = get_db()
        if db is None:
            raise HTTPException(status_code=500, detail="Database connection failed")

        raw_collection = db["raw_data"]
        target_collection = db["data"]

        raw_cursor = raw_collection.find()

        clean_data = []
        skipped = 0

        for doc in raw_cursor:
            try:
                normalized = normalize_doc(doc)
                if normalized:
                    clean_data.append(normalized)
                else:
                    skipped += 1
            except Exception:
                skipped += 1

        if not clean_data:
            return {"message": "No valid data found", "inserted": 0, "skipped": skipped}

        try:
            result = target_collection.insert_many(clean_data)
        except PyMongoError as e:
            raise HTTPException(status_code=500, detail=f"DB insert failed: {str(e)}")

        return {
            "message": "Normalization complete",
            "inserted": len(result.inserted_ids),
            "skipped": skipped,
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
