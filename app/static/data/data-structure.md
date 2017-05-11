## How should the date be structured

Wir brauchen die einzelnen Fragen als Markdown-Dokumente

```
+++
title = "Portfolioaufgabe 3"
semester = "SS17"
description = "Lorem ipsum"
date = "2016-04-06T16:11:58+05:30"
field = "Fachdidaktik"
course_id = "342"
parent_course_id = "143"
+++

Here comes the artifact
```

```
[{
  "about": {
    "matriculation-number": 87343443,
    "first-name": "Hans",
    "last-name": "Zimmer",
    "subject-first": "Englisch",
    "subject-second": "Deutsch",
    "subject-third": "Mathematik"
  },

  "portfolio": [
    {
      "id": 4,
      "name": "Einführung in die Bildungswissenschaft",
      "semester": "2017 WS",
      "teacher": "Prof. Dr. Matthias Nückles",
      "link": "http://testlink.de",
      "field": "Bildungswissenschaft",
      "portfolio": [
        {
          "id": 132,
          "date": "2016-04-06T16:11:58+05:30",
          "parent-course": 454,
          "title": "Portfolioaufgabe 1",
          "description": "Wie ist das Arbeitsgedächtnis aufgebaut",
          "artifact": "Lorem ipsum"
        }
      ]
    }
  ]
}]
```
