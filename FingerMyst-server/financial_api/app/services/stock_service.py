"""Stock securities information service module.

Provides functions to query and search securities information from baostock API
with local caching support for better performance.
"""
import os
import pickle
import time
from datetime import datetime
from typing import List, Dict, Any, Optional
import baostock as bs


# Configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CACHE_DIR = os.path.join(BASE_DIR, "stock_basic")
CACHE_FILE = os.path.join(CACHE_DIR, "stock_info")
CACHE_EXPIRATION = 24 * 60 * 60  # 24 hours in seconds


def get_all_securities(use_cache: bool = True) -> List[Dict[str, str]]:
    """Get all securities information.

    First tries to read from local cache. If cache doesn't exist, is empty,
    or has expired (24 hours), fetches from baostock API and updates cache.

    Args:
        use_cache: Whether to use cache. Default True.

    Returns:
        List of securities info dictionaries.
    """
    if use_cache:
        cached_data = _read_from_cache()
        if cached_data is not None:
            return cached_data

    # Fetch from API and cache
    data = _fetch_from_api()
    if data:
        _write_to_cache(data)
    return data


def search_securities(
    name: Optional[str] = None,
    code: Optional[str] = None,
    sec_type: Optional[str] = None,
    status: Optional[str] = None
) -> List[Dict[str, str]]:
    """Search securities with optional filters.

    All parameters are optional. Security name and code support fuzzy (substring) search.
    Multiple filters are combined with AND logic.

    Args:
        name: Security name for fuzzy search (case-insensitive)
        code: Security code for fuzzy search (case-insensitive)
        sec_type: Security type (1-股票, 2-指数, 3-其它, 4-可转债, 5-ETF)
        status: Listing status (1-上市, 0-退市)

    Returns:
        List of matching securities info dictionaries.
    """
    all_securities = get_all_securities()
    result = all_securities

    # Apply filters
    if name:
        name_lower = name.lower()
        result = [s for s in result if name_lower in s.get("code_name", "").lower()]

    if code:
        code_lower = code.lower()
        result = [s for s in result if code_lower in s.get("code", "").lower()]

    if sec_type is not None:
        result = [s for s in result if s.get("type") == str(sec_type)]

    if status is not None:
        result = [s for s in result if s.get("status") == str(status)]

    return result


def refresh_cache() -> bool:
    """Force refresh the cache by fetching latest data from API.

    Returns:
        True if refresh successful, False otherwise.
    """
    data = _fetch_from_api()
    if data:
        _write_to_cache(data)
        return True
    return False


def get_cache_status() -> Dict[str, Any]:
    """Get cache status information.

    Returns:
        Dict with cached, count, last_updated, message.
    """
    if not os.path.exists(CACHE_FILE):
        return {
            "cached": False,
            "count": 0,
            "last_updated": None,
            "message": "缓存文件不存在"
        }

    try:
        with open(CACHE_FILE, "rb") as f:
            cache_data = pickle.load(f)

        cache_time = cache_data.get("timestamp", 0)
        current_time = time.time()
        data = cache_data.get("data", [])

        # Check if expired
        is_expired = (current_time - cache_time) > CACHE_EXPIRATION
        last_updated = datetime.fromtimestamp(cache_time).strftime("%Y-%m-%d %H:%M:%S")

        return {
            "cached": True,
            "count": len(data),
            "last_updated": last_updated,
            "message": "缓存已过期" if is_expired else "缓存有效"
        }

    except Exception as e:
        return {
            "cached": False,
            "count": 0,
            "last_updated": None,
            "message": f"缓存读取错误: {str(e)}"
        }


def _fetch_from_api() -> List[Dict[str, str]]:
    """Fetch all securities data from baostock API.

    Returns:
        List of securities info dictionaries.
    """
    # Login to baostock
    lg = bs.login()
    if lg.error_code != "0":
        raise Exception(f"Login failed: {lg.error_msg}")

    try:
        # Query all securities (no parameters = get all)
        rs = bs.query_stock_basic()

        if rs.error_code != "0":
            raise Exception(f"Query failed: {rs.error_msg}")

        # Collect all data
        data_list = []
        while rs.error_code == "0" and rs.next():
            row_data = rs.get_row_data()
            data_dict = dict(zip(rs.fields, row_data))
            data_list.append(data_dict)

        return data_list

    finally:
        bs.logout()


def _read_from_cache() -> Optional[List[Dict[str, str]]]:
    """Read securities data from local cache file.

    Returns None if cache doesn't exist, is empty/corrupted, or expired.

    Returns:
        Cached data or None.
    """
    if not os.path.exists(CACHE_FILE):
        return None

    try:
        with open(CACHE_FILE, "rb") as f:
            cache_data = pickle.load(f)

        # Check if cache has expired
        cache_time = cache_data.get("timestamp", 0)
        current_time = time.time()

        if current_time - cache_time > CACHE_EXPIRATION:
            return None

        return cache_data.get("data", [])

    except (pickle.PickleError, EOFError, KeyError):
        return None


def _write_to_cache(data: List[Dict[str, str]]) -> None:
    """Write securities data to local cache file.

    Args:
        data: List of securities info dictionaries.
    """
    cache_data = {
        "timestamp": time.time(),
        "data": data
    }

    # Ensure directory exists
    os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)

    with open(CACHE_FILE, "wb") as f:
        pickle.dump(cache_data, f)
