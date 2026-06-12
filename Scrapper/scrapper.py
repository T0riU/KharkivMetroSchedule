import requests
import json
from bs4 import BeautifulSoup
import csv
import os
OUTPUT_DIR = "data"
BASE_URL = "https://www.metro.kharkiv.ua"

def load_old_data(filename="scraped_data.json"):
    path = os.path.join(OUTPUT_DIR, filename)
    if not os.path.exists(path):
        return None

    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
    
def is_data_changed(new_data, old_data):
    return new_data != old_data

def get_links_from_div(url, div_class):
    print(f"[LINKS] Fetching: {url}")
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    div = soup.find("div", class_=div_class)
    if div:
        links = [requests.compat.urljoin(BASE_URL, a['href']) for a in div.find_all('a', href=True)]
        print(f"[LINKS] Found {len(links)} links")
        return links
    print("[LINKS] No links found")
    return []

def get_tables_from_page(url):
    print(f"[TABLE] Parsing: {url}")
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    
    tables = []
    for table in soup.find_all('table'):
        rows = []
        for tr in table.find_all('tr'):
            cells = [td.get_text(strip=True) for td in tr.find_all(['td', 'th'])]
            rows.append(cells)
        tables.append(rows)
    
    result = extract_times(tables)
    print(f"[TABLE] Extracted {len(result)} tables")
    return result

def extract_times(data):
    transformed_data = []
    
    for table in data:
        merged_table = []
        for row in table:
            if not row:
                continue
            if len(row) < 2:
                continue
            base = row[0]
            cleaned_minutes = [m.replace('*', '') for m in row[1:] if m]
            merged_table.extend([f"{base}{m.zfill(2)}" for m in cleaned_minutes])
        transformed_data.append(merged_table)
    
    return transformed_data

def remove_base_url(data):
    if isinstance(data, dict):
        return {key.replace(BASE_URL, ''): remove_base_url(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [remove_base_url(item) for item in data]
    return data

def save_to_json(data, filename="scraped_data.json"):
    try:
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        path = os.path.join(OUTPUT_DIR, filename)

        data_without_base = remove_base_url(data)
        old_data = load_old_data(filename)
        if old_data is not None and not is_data_changed(data_without_base, old_data):
            print("[SKIP] Data unchanged, not updating file")
            return False
        with open(path, "w", encoding="utf-8") as file:
            json.dump(data_without_base, file, ensure_ascii=False, indent=4)
        print("[SAVE] Data updated")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

def scrape_site(start_url):
    print("[START] Scraping started")
    level_1_links = get_links_from_div(start_url, "content-text content-text-border mob-img")
    all_data = {}

    for i, link_1 in enumerate(level_1_links, 1):
        print(f"[LEVEL 1] {i}/{len(level_1_links)} -> {link_1}")

        level_2_links = get_links_from_div(link_1, "content-text content-text-border mob-img")
        all_data[link_1] = {}

        for j, link_2 in enumerate(level_2_links, 1):
            print(f"  [LEVEL 2] {j}/{len(level_2_links)} -> {link_2}")

            level_3_links = get_links_from_div(link_2, "content-text content-text-border mob-img")
            all_data[link_1][link_2] = {}

            for k, link_3 in enumerate(level_3_links, 1):
                print(f"    [LEVEL 3] {k}/{len(level_3_links)} -> {link_3}")

                all_data[link_1][link_2][link_3] = get_tables_from_page(link_3)

    print("[DONE] Scraping finished")
    changed = save_to_json(all_data, "scraped_data.json")
    return all_data, changed

start_url = BASE_URL + "/hkrafiky-krukhu-poizdiv/"
print(start_url)
data = scrape_site(start_url)
print(data)