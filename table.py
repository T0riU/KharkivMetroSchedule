from bs4 import BeautifulSoup

# HTML content (replace this string with your actual HTML content)
html_content = """<div class="content-text content-text-border mob-img">
                        <h3 style="text-align: center;"><strong>ЧАС ВІДПРАВЛЕННЯ ПОЇЗДІВ<br>В НАПРЯМКУ СТАНЦІЇ </strong><strong>«ІСТОРИЧНИЙ МУЗЕЙ»&nbsp;</strong></h3>
<h6 style="text-align: center;"><span style="color: #ff0000;">У зв'язку з воєнним станом в країні можливі зміни у графіку руху поїздів<br>із незалежних від метрополітену причин.</span></h6>
<p>&nbsp;</p>
<table style="height: 550px; width: 28.9541%; border-collapse: collapse; border-style: outset; margin-left: auto; margin-right: auto;" border="1">
<tbody>
<tr style="height: 18px;">
<td style="width: 1.8271%; height: 18px; background-color: grey; border-color: black; text-align: center;">
<h3 style="text-align: center;"><span style="color: #ffffff;">5:</span></h3>
</td>
<td style="width: 4.61044%; height: 18px; text-align: center;">
<h3>40</h3>
</td>
<td style="width: 4.67663%; height: 18px; text-align: center;">
<h3>50</h3>
</td>
<td style="width: 4.54412%; height: 18px; text-align: center;">
<h3>&nbsp;</h3>
</td>
<td style="width: 4.27904%; height: 18px; text-align: center;">&nbsp;</td>
<td style="width: 4.6767%; height: 18px; text-align: center;">&nbsp;</td>
<td style="width: 4.70847%; height: 18px; text-align: center;">&nbsp;</td>
</tr>
<tr style="height: 18px; background-color: white; text-align: center;">
<td style="width: 1.8271%; height: 18px; background-color: grey; border-color: black; text-align: center;">
<h3><span style="color: #ffffff;">6:</span></h3>
</td>
<td style="width: 4.61044%; height: 18px; text-align: center;">
<h3>00</h3>
</td>
<td style="width: 4.67663%; height: 18px; text-align: center;">
<h3>10</h3>
</td>
<td style="width: 4.54412%; height: 18px;">
<h3>20</h3>
</td>
<td style="width: 4.27904%; height: 18px;">
<h3>30</h3>
</td>
<td style="width: 4.6767%; height: 18px;">
<h3>40</h3>
</td>
<td style="width: 4.70847%; height: 18px;">
<h3>50</h3>
</td>
</tr>
<tr style="height: 18px; text-align: center;">
<td style="width: 1.8271%; height: 18px; background-color: grey; border-color: black; text-align: center;">
<h3><span style="color: #ffffff;">7:</span></h3>
</td>
<td style="width: 4.61044%; height: 18px; text-align: center;">
<h3>00</h3>
</td>
<td style="width: 4.67663%; height: 18px; text-align: center;">
<h3>10</h3>
</td>
<td style="width: 4.54412%; height: 18px;">
<h3>20</h3>
</td>
<td style="width: 4.27904%; height: 18px;">
<h3>30</h3>
</td>
<td style="width: 4.6767%; height: 18px;">
<h3>40</h3>
</td>
<td style="width: 4.70847%; height: 18px;">
<h3>50</h3>
</td>
</tr>
<tr style="height: 18px; text-align: center;">
<td style="width: 1.8271%; height: 18px; background-color: grey; border-color: black; text-align: center;">
<h3><span style="color: #ffffff;">8:</span></h3>
</td>
<td style="width: 4.61044%; height: 18px; text-align: center;">
<h3>00</h3>
</td>
<td style="width: 4.67663%; height: 18px; text-align: center;">
<h3>10</h3>
</td>
<td style="width: 4.54412%; height: 18px;">
<h3>20</h3>
</td>
<td style="width: 4.27904%; height: 18px;">
<h3>30</h3>
</td>
<td style="width: 4.6767%; height: 18px;">
<h3>40</h3>
</td>
<td style="width: 4.70847%; height: 18px;">
<h3>50</h3>
</td>
</tr>
<tr style="height: 18px; text-align: center;">
<td style="width: 1.8271%; height: 18px; background-color: grey; border-color: black;">
<h3><span style="color: #ffffff;">9:</span></h3>
</td>
<td style="width: 4.61044%; height: 18px; text-align: center;">
<h3>00</h3>
</td>
<td style="width: 4.67663%; height: 18px; text-align: center;">
<h3>10</h3>
</td>
<td style="width: 4.54412%; height: 18px;">
<h3>20</h3>
</td>
<td style="width: 4.27904%; height: 18px;">
<h3>30</h3>
</td>
<td style="width: 4.6767%; height: 18px;">
<h3>40</h3>
</td>
<td style="width: 4.70847%; height: 18px;">
<h3>50</h3>
</td>
</tr>
<tr style="height: 18px; text-align: center;">
<td style="width: 1.8271%; height: 18px; background-color: grey; border-color: black;">
<h3><span style="color: #ffffff;">10:</span></h3>
</td>
<td style="width: 4.61044%; height: 18px; text-align: center;">
<h3>00</h3>
</td>
<td style="width: 4.67663%; height: 18px; text-align: center;">
<h3>10</h3>
</td>
<td style="width: 4.54412%; height: 18px;">
<h3>20</h3>
</td>
<td style="width: 4.27904%; height: 18px;">
<h3>30</h3>
</td>
<td style="width: 4.6767%; height: 18px;">
<h3>40</h3>
</td>
<td style="width: 4.70847%; height: 18px;">
<h3>50</h3>
</td>
</tr>
<tr style="height: 18px; text-align: center;">
<td style="width: 1.8271%; height: 18px; background-color: grey; border-color: black;">
<h3><span style="color: #ffffff;">11:</span></h3>
</td>
<td style="width: 4.61044%; height: 18px; text-align: center;">
<h3>00</h3>
</td>
<td style="width: 4.67663%; height: 18px; text-align: center;">
<h3>10</h3>
</td>
<td style="width: 4.54412%; height: 18px;">
<h3>20</h3>
</td>
<td style="width: 4.27904%; height: 18px;">
<h3>30</h3>
</td>
<td style="width: 4.6767%; height: 18px;">
<h3>40</h3>
</td>
<td style="width: 4.70847%; height: 18px;">
<h3>50</h3>
</td>
</tr>
<tr style="height: 18px; text-align: center;">
<td style="width: 1.8271%; height: 18px; background-color: grey; border-color: black;">
<h3><span style="color: #ffffff;">12:</span></h3>
</td>
<td style="width: 4.61044%; height: 18px; text-align: center;">
<h3>00</h3>
</td>
<td style="width: 4.67663%; height: 18px; text-align: center;">
<h3>10</h3>
</td>
<td style="width: 4.54412%; height: 18px;">
<h3>20</h3>
</td>
<td style="width: 4.27904%; height: 18px;">
<h3>30</h3>
</td>
<td style="width: 4.6767%; height: 18px;">
<h3>40</h3>
</td>
<td style="width: 4.70847%; height: 18px;">
<h3>50</h3>
</td>
</tr>
<tr style="height: 19px; text-align: center;">
<td style="width: 1.8271%; height: 19px; background-color: grey; border-color: black;">
<h3><span style="color: #ffffff;">13:</span></h3>
</td>
<td style="width: 4.61044%; height: 18px; text-align: center;">
<h3>00</h3>
</td>
<td style="width: 4.67663%; height: 18px; text-align: center;">
<h3>10</h3>
</td>
<td style="width: 4.54412%; height: 18px;">
<h3>20</h3>
</td>
<td style="width: 4.27904%; height: 18px;">
<h3>30</h3>
</td>
<td style="width: 4.6767%; height: 18px;">
<h3>40</h3>
</td>
<td style="width: 4.70847%; height: 18px;">
<h3>50</h3>
</td>
</tr>
<tr style="height: 43px; text-align: center;">
<td style="width: 1.8271%; height: 43px; background-color: grey; border-color: black;">
<h3><span style="color: #ffffff;">14:</span></h3>
</td>
<td style="width: 4.61044%; height: 18px; text-align: center;">
<h3>00</h3>
</td>
<td style="width: 4.67663%; height: 18px; text-align: center;">
<h3>10</h3>
</td>
<td style="width: 4.54412%; height: 18px;">
<h3>20</h3>
</td>
<td style="width: 4.27904%; height: 18px;">
<h3>30</h3>
</td>
<td style="width: 4.6767%; height: 18px;">
<h3>40</h3>
</td>
<td style="width: 4.70847%; height: 18px;">
<h3>50</h3>
</td>
</tr>
<tr style="height: 43px; text-align: center;">
<td style="width: 1.8271%; height: 43px; background-color: grey; border-color: black;">
<h3><span style="color: #ffffff;">15:</span></h3>
</td>
<td style="width: 4.61044%; height: 18px; text-align: center;">
<h3>00</h3>
</td>
<td style="width: 4.67663%; height: 18px; text-align: center;">
<h3>10</h3>
</td>
<td style="width: 4.54412%; height: 18px;">
<h3>20</h3>
</td>
<td style="width: 4.27904%; height: 18px;">
<h3>30</h3>
</td>
<td style="width: 4.6767%; height: 18px;">
<h3>40</h3>
</td>
<td style="width: 4.70847%; height: 18px;">
<h3>50</h3>
</td>
</tr>
<tr style="height: 43px; text-align: center;">
<td style="width: 1.8271%; height: 43px; background-color: grey; border-color: black;">
<h3><span style="color: #ffffff;">16:</span></h3>
</td>
<td style="width: 4.61044%; height: 18px; text-align: center;">
<h3>00</h3>
</td>
<td style="width: 4.67663%; height: 18px; text-align: center;">
<h3>10</h3>
</td>
<td style="width: 4.54412%; height: 18px;">
<h3>20</h3>
</td>
<td style="width: 4.27904%; height: 18px;">
<h3>30</h3>
</td>
<td style="width: 4.6767%; height: 18px;">
<h3>40</h3>
</td>
<td style="width: 4.70847%; height: 18px;">
<h3>50</h3>
</td>
</tr>
<tr style="height: 43px; text-align: center;">
<td style="width: 1.8271%; height: 43px; background-color: grey; border-color: black;">
<h3><span style="color: #ffffff;">17:</span></h3>
</td>
<td style="width: 4.61044%; height: 18px; text-align: center;">
<h3>00</h3>
</td>
<td style="width: 4.67663%; height: 18px; text-align: center;">
<h3>10</h3>
</td>
<td style="width: 4.54412%; height: 18px;">
<h3>20</h3>
</td>
<td style="width: 4.27904%; height: 18px;">
<h3>30</h3>
</td>
<td style="width: 4.6767%; height: 18px;">
<h3>40</h3>
</td>
<td style="width: 4.70847%; height: 18px;">
<h3>50</h3>
</td>
</tr>
<tr style="height: 43px; text-align: center;">
<td style="width: 1.8271%; height: 43px; background-color: grey; border-color: black;">
<h3><span style="color: #ffffff;">18:</span></h3>
</td>
<td style="width: 4.61044%; height: 18px; text-align: center;">
<h3>00</h3>
</td>
<td style="width: 4.67663%; height: 18px; text-align: center;">
<h3>10</h3>
</td>
<td style="width: 4.54412%; height: 18px;">
<h3>20</h3>
</td>
<td style="width: 4.27904%; height: 18px;">
<h3>30</h3>
</td>
<td style="width: 4.6767%; height: 18px;">
<h3>40</h3>
</td>
<td style="width: 4.70847%; height: 18px;">
<h3>50</h3>
</td>
</tr>
<tr style="height: 43px; text-align: center;">
<td style="width: 1.8271%; height: 43px; background-color: grey; border-color: black;">
<h3><span style="color: #ffffff;">19:</span></h3>
</td>
<td style="width: 4.61044%; height: 18px; text-align: center;">
<h3>00</h3>
</td>
<td style="width: 4.67663%; height: 18px; text-align: center;">
<h3>10</h3>
</td>
<td style="width: 4.54412%; height: 18px;">
<h3>20</h3>
</td>
<td style="width: 4.27904%; height: 18px;">
<h3>30</h3>
</td>
<td style="width: 4.6767%; height: 18px;">
<h3>40</h3>
</td>
<td style="width: 4.70847%; height: 18px;">
<h3>50</h3>
</td>
</tr>
<tr style="height: 43px; text-align: center;">
<td style="width: 1.8271%; height: 43px; background-color: grey; border-color: black;">
<h3><span style="color: #ffffff;">20:</span></h3>
</td>
<td style="width: 4.61044%; height: 43px;">
<h3>00</h3>
</td>
<td style="width: 4.67663%; height: 43px;">
<h3>20</h3>
</td>
<td style="width: 4.54412%; height: 43px;">
<h3>40</h3>
</td>
<td style="width: 4.27904%; height: 43px;">
<h3>&nbsp;</h3>
</td>
<td style="width: 4.6767%; height: 43px;">&nbsp;</td>
<td style="width: 4.70847%; height: 43px;">&nbsp;</td>
</tr>
<tr style="height: 43px; text-align: center;">
<td style="width: 1.8271%; height: 43px; background-color: grey; border-color: black;">
<h3><span style="color: #ffffff;">21:</span></h3>
</td>
<td style="width: 4.61044%; height: 43px;">
<h3>00</h3>
</td>
<td style="width: 4.67663%; height: 43px;">
<h3>20</h3>
</td>
<td style="width: 4.54412%; height: 43px;">
<h3>35*</h3>
</td>
<td style="width: 4.27904%; height: 43px;">
<h3>&nbsp;</h3>
</td>
<td style="width: 4.6767%; height: 43px;">&nbsp;</td>
<td style="width: 4.70847%; height: 43px;">&nbsp;</td>
</tr>
</tbody>
</table>
<h6 style="text-align: center;"><span style="color: #ff0000;">* Вестибюлі станцій метрополітену зачиняються о 21:30.</span><br><span style="color: #ff0000;">Щоб потрапити на ці поїзди - слід заздалегідь прибути на станцію.</span></h6>
                        <div class="clearfix"></div>
                    </div>"""  # Place your full HTML content here

# Function to extract times from a single table
def extract_times(table):
    rows = table.find_all("tr")
    times = []
    for row in rows:
        cells = row.find_all("td")
        hour = ""
        for i, cell in enumerate(cells):
            if i == 0:  # Hour cell
                hour = cell.get_text(strip=True).replace(":", "")
            else:  # Minutes cells
                minutes = cell.get_text(strip=True)
                if minutes.isdigit():  # Avoid empty or invalid cells
                    times.append(f"{hour}:{minutes.zfill(2)}")
    return times

# Parse the HTML content
soup = BeautifulSoup(html_content, "html.parser")
tables = soup.find_all("table")  # Adjust this if your table is within a specific class or ID

# Assuming the first link has only one table (missing second table)
# and the last link has one table (missing first table)
results = {}
num_links = 5  # Example: total links; replace with actual number
for i in range(1, num_links + 1):
    link_key = f"link_{i}"
    tables_for_link = tables[(i - 1) * 2 : i * 2]  # Get two tables per link
    if i == 1:  # First link: only second table is empty
        results[link_key] = {"table_1": extract_times(tables_for_link[0]), "table_2": []}
    elif i == num_links:  # Last link: only first table is empty
        results[link_key] = {"table_1": [], "table_2": extract_times(tables_for_link[0])}
    else:  # Other links: process both tables
        results[link_key] = {
            "table_1": extract_times(tables_for_link[0]),
            "table_2": extract_times(tables_for_link[1]),
        }

# Print or save the results
for link, data in results.items():
    print(f"{link}:")
    print(f"  Table 1: {data['table_1']}")
    print(f"  Table 2: {data['table_2']}")
