# Trailhead E2E Test Suite

**Date:** 2026-05-20T00:25:02.398Z
**Events:** 6
**Duration:** 3036ms

---

### Sequence

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 00:24:59.364 | Recv | sql:unknown | `{"changes":"batch"}` |
| 2 | 00:25:02.389 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 3 | 00:25:02.390 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":2}` |
| 4 | 00:25:02.393 | Send | sql.fixture | `1 rows` |
| 5 | 00:25:02.394 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779236702387-9el539","description":"Hello world test"}` |
| 6 | 00:25:02.395 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:unknown</summary>

```json
{
  "changes": "batch"
}
```

</details>

<details><summary>2. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>3. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 2
}
```

</details>

---

