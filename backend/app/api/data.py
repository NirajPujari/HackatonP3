from fastapi import APIRouter, Depends, HTTPException
from app.services.db import get_collection
from app.db import get_db
from pymongo.errors import PyMongoError

router = APIRouter()


@router.get("/raw-data")
def fetch_raw_data(_=Depends(get_db)):
    try:
        collection = get_collection("raw_data")
        data = list(collection)

        if not data:
            return {"message": "No raw data found", "data": []}

        return {
            "count": len(data),
            "data": data
        }

    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.get("/data")
def fetch_data(_=Depends(get_db)):
    try:
        collection = get_collection("data")
        data = list(collection)

        if not data:
            return {"message": "No data found", "data": []}

        return {
            "count": len(data),
            "data": data
        }

    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")