import requests
import json
from bs4 import BeautifulSoup
import csv

BASE_URL = "https://www.metro.kharkiv.ua/"  # Замініть на базовий URL сайту

def get_links_from_div(url, div_class):
    """Витягує всі посилання з div за заданим класом."""
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    div = soup.find("div", class_=div_class)
    if div:
        return [BASE_URL + a['href'] for a in div.find_all('a', href=True)]
    return []

def get_tables_from_page(url):
    """Витягує всі таблиці з вказаної сторінки та формує часи у форматі HH:MM."""
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    
    tables = []
    for table in soup.find_all('table'):
        rows = []
        for tr in table.find_all('tr'):
            cells = [td.get_text(strip=True) for td in tr.find_all(['td', 'th'])]
            rows.append(cells)
        tables.append(rows)
    
    times = extract_times(tables)
    return times
def extract_times(data):
    """Transforms input data into the desired format without empty cells."""
    transformed_data = []
    
    for table in data:
        merged_table = []  # This will store merged times for the current table
        for row in table:
            cleaned_minutes = [minute.replace('*', '') for minute in row[1:] if minute]
            merged_table.extend([f"{row[0]}{minute.zfill(2)}" for minute in cleaned_minutes])
        transformed_data.append(merged_table)
    
    return transformed_data

def remove_base_url(data):
    """Рекурсивно видаляє базовий URL зі структури даних."""
    if isinstance(data, dict):
        return {
            key.replace(BASE_URL, ''): remove_base_url(value)
            for key, value in data.items()
        }
    elif isinstance(data, list):
        return [remove_base_url(item) for item in data]
    else:
        return data
def save_to_json(data, filename="scraped_data.json"):
    """Зберігає дані у файл JSON."""
    try:
        # Видалити базовий URL перед збереженням
        data_without_base = remove_base_url(data)
        with open(filename, "w", encoding="utf-8") as file:
            json.dump(data_without_base, file, ensure_ascii=False, indent=4)
        print(f"Дані успішно збережено у файл {filename}")
    except Exception as e:
        print(f"Помилка при збереженні даних у файл: {e}")

def scrape_site(start_url):
    """Основна функція для скрапінгу."""
    level_1_links = get_links_from_div(start_url, "content-text content-text-border mob-img")
    all_data = {}

    for link_1 in level_1_links:
        level_2_links = get_links_from_div(link_1, "content-text content-text-border mob-img")
        all_data[link_1] = {}

        for link_2 in level_2_links:
            level_3_links = get_links_from_div(link_2, "content-text content-text-border mob-img")
            all_data[link_1][link_2] = {}
            
            # all_data[link_1][link_2][0] = get_tables_from_page(level_3_links[0])
            for link_3 in level_3_links:
                # level_4_tables = get_tables_from_page(link_3)
                # all_data[link_1][link_2][link_3] = level_4_tables
                all_data[link_1][link_2][link_3] = ''

    save_to_json(all_data)
    return all_data

# Виклик функції та запис результату
start_url = BASE_URL + "/hkrafiky-krukhu-poizdiv/"
print(start_url)
data = scrape_site(start_url)
print(data)

