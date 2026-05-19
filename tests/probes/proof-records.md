# Trailhead E2E Test Suite

**Date:** 2026-05-19T19:24:24.651Z
**Events:** 182
**Duration:** 3159ms

---

## (setup)

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:21.494 | Recv | sql:unknown | `{"changes":"batch"}` |
| 2 | 19:24:24.514 | Recv | sql:sqlite_master | `[{"name":"projects"},{"name":"jobs"},{"name":"workers"},{"name":"checkpoints"},{"name":"prompt_history"},{"name":"workflows"}]` |
| 3 | 19:24:24.516 | Recv | sql:projects | `{"changes":"batch"}` |
| 4 | 19:24:24.517 | Recv | sql:jobs | `{"changes":"batch"}` |
| 5 | 19:24:24.519 | Recv | sql:workers | `{"changes":"batch"}` |
| 6 | 19:24:24.520 | Recv | sql:checkpoints | `{"changes":"batch"}` |
| 7 | 19:24:24.522 | Recv | sql:prompt_history | `{"changes":"batch"}` |
| 8 | 19:24:24.523 | Recv | sql:workflows | `{"changes":"batch"}` |
| 9 | 19:24:24.523 | Send | sql.clear | `all tables` |
| 10 | 19:24:24.539 | Recv | sql:sqlite_master | `{"name":"workflows"}` |
| 11 | 19:24:24.544 | Recv | sql:workflows | `{"changes":1,"lastInsertRowid":1}` |
| 12 | 19:24:24.544 | Recv | sql:workflows | `{"changes":1,"lastInsertRowid":2}` |
| 13 | 19:24:24.548 | Send | sql.fixture | `2 rows` |
| 14 | 19:24:24.558 | Recv | sql:sqlite_master | `[{"name":"projects"},{"name":"jobs"},{"name":"workers"},{"name":"checkpoints"},{"name":"prompt_history"},{"name":"workflows"}]` |
| 15 | 19:24:24.559 | Recv | sql:projects | `{"changes":"batch"}` |
| 16 | 19:24:24.560 | Recv | sql:jobs | `{"changes":"batch"}` |
| 17 | 19:24:24.561 | Recv | sql:workers | `{"changes":"batch"}` |
| 18 | 19:24:24.562 | Recv | sql:checkpoints | `{"changes":"batch"}` |
| 19 | 19:24:24.563 | Recv | sql:prompt_history | `{"changes":"batch"}` |
| 20 | 19:24:24.564 | Recv | sql:workflows | `{"changes":"batch"}` |
| 21 | 19:24:24.564 | Send | sql.clear | `all tables` |
| 22 | 19:24:24.565 | Recv | sql:sqlite_master | `{"name":"workflows"}` |
| 23 | 19:24:24.565 | Recv | sql:workflows | `{"changes":1,"lastInsertRowid":1}` |
| 24 | 19:24:24.565 | Recv | sql:workflows | `{"changes":1,"lastInsertRowid":2}` |
| 25 | 19:24:24.568 | Send | sql.fixture | `2 rows` |
| 26 | 19:24:24.632 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 27 | 19:24:24.632 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":17}` |
| 28 | 19:24:24.634 | Send | sql.fixture | `1 rows` |
| 29 | 19:24:24.634 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664632-vm2f8u","description":"Hello world test"}` |
| 30 | 19:24:24.634 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:unknown</summary>

```json
{
  "changes": "batch"
}
```

</details>

<details><summary>2. Recv sql:sqlite_master</summary>

```json
[
  {
    "name": "projects"
  },
  {
    "name": "jobs"
  },
  {
    "name": "workers"
  },
  {
    "name": "checkpoints"
  },
  {
    "name": "prompt_history"
  },
  {
    "name": "workflows"
  }
]
```

</details>

<details><summary>3. Recv sql:projects</summary>

```json
{
  "changes": "batch"
}
```

</details>

<details><summary>4. Recv sql:jobs</summary>

```json
{
  "changes": "batch"
}
```

</details>

<details><summary>5. Recv sql:workers</summary>

```json
{
  "changes": "batch"
}
```

</details>

<details><summary>6. Recv sql:checkpoints</summary>

```json
{
  "changes": "batch"
}
```

</details>

<details><summary>7. Recv sql:prompt_history</summary>

```json
{
  "changes": "batch"
}
```

</details>

<details><summary>8. Recv sql:workflows</summary>

```json
{
  "changes": "batch"
}
```

</details>

<details><summary>10. Recv sql:sqlite_master</summary>

```json
{
  "name": "workflows"
}
```

</details>

<details><summary>11. Recv sql:workflows</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 1
}
```

</details>

<details><summary>12. Recv sql:workflows</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 2
}
```

</details>

<details><summary>14. Recv sql:sqlite_master</summary>

```json
[
  {
    "name": "projects"
  },
  {
    "name": "jobs"
  },
  {
    "name": "workers"
  },
  {
    "name": "checkpoints"
  },
  {
    "name": "prompt_history"
  },
  {
    "name": "workflows"
  }
]
```

</details>

<details><summary>15. Recv sql:projects</summary>

```json
{
  "changes": "batch"
}
```

</details>

<details><summary>16. Recv sql:jobs</summary>

```json
{
  "changes": "batch"
}
```

</details>

<details><summary>17. Recv sql:workers</summary>

```json
{
  "changes": "batch"
}
```

</details>

<details><summary>18. Recv sql:checkpoints</summary>

```json
{
  "changes": "batch"
}
```

</details>

<details><summary>19. Recv sql:prompt_history</summary>

```json
{
  "changes": "batch"
}
```

</details>

<details><summary>20. Recv sql:workflows</summary>

```json
{
  "changes": "batch"
}
```

</details>

<details><summary>22. Recv sql:sqlite_master</summary>

```json
{
  "name": "workflows"
}
```

</details>

<details><summary>23. Recv sql:workflows</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 1
}
```

</details>

<details><summary>24. Recv sql:workflows</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 2
}
```

</details>

<details><summary>26. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>27. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 17
}
```

</details>

---

## lists jobs via HTTP matching DB count

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.549 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.549 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":1}` |
| 3 | 19:24:24.551 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.551 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664548-esmjmh","description":"Job 1"}` |
| 5 | 19:24:24.555 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 1
}
```

</details>

---

## list workers via HTTP matching DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.568 | Send | http.send | `GET /api/v1/workers` |
| 2 | 19:24:24.569 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

---

## GET /api/v1/jobs returns list matching DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.571 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.571 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":1}` |
| 3 | 19:24:24.572 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.572 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664571-m3xs9z","description":"Dashboard test job"}` |
| 5 | 19:24:24.573 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 1
}
```

</details>

---

## GET /api/v1/jobs/{id} returns detail matching DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.573 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.573 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":2}` |
| 3 | 19:24:24.574 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.574 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664573-l5cqgs","description":"Detail test"}` |
| 5 | 19:24:24.574 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 2
}
```

</details>

---

## GET /api/v1/workers returns list matching DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.574 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.574 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":3}` |
| 3 | 19:24:24.577 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.577 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664574-m6sx7e","description":"Worker list test"}` |
| 5 | 19:24:24.578 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 3
}
```

</details>

---

## POST /api/v1/jobs/{id}/cancel changes status in DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.578 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.578 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":4}` |
| 3 | 19:24:24.581 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.581 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664578-wt47ju","description":"Cancel via dashboard"}` |
| 5 | 19:24:24.581 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 4
}
```

</details>

---

## new job is queued in DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.583 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.583 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":5}` |
| 3 | 19:24:24.584 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.584 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664583-e9ohr2","description":"State machine test"}` |
| 5 | 19:24:24.584 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |
| 6 | 19:24:24.641 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 7 | 19:24:24.641 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":19}` |
| 8 | 19:24:24.642 | Send | sql.fixture | `1 rows` |
| 9 | 19:24:24.642 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664641-mgg3t4","description":"Start at first stage"}` |
| 10 | 19:24:24.642 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 5
}
```

</details>

<details><summary>6. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>7. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 19
}
```

</details>

---

## running to paused via HTTP

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.585 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.585 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":6}` |
| 3 | 19:24:24.586 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.586 | Recv | sql:sqlite_master | `{"name":"jobs"}` |
| 5 | 19:24:24.586 | Recv | sql:jobs | `{"changes":1,"lastInsertRowid":1}` |
| 6 | 19:24:24.588 | Send | sql.fixture | `1 rows` |
| 7 | 19:24:24.588 | Send | http.send | `POST /api/v1/jobs/test-1779218664586-z9ezh7/pause` |
| 8 | 19:24:24.588 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 6
}
```

</details>

<details><summary>4. Recv sql:sqlite_master</summary>

```json
{
  "name": "jobs"
}
```

</details>

<details><summary>5. Recv sql:jobs</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 1
}
```

</details>

---

## paused to resuming via HTTP

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.588 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.588 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":7}` |
| 3 | 19:24:24.589 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.589 | Recv | sql:sqlite_master | `{"name":"jobs"}` |
| 5 | 19:24:24.589 | Recv | sql:jobs | `{"changes":1,"lastInsertRowid":2}` |
| 6 | 19:24:24.590 | Send | sql.fixture | `1 rows` |
| 7 | 19:24:24.590 | Send | http.send | `POST /api/v1/jobs/test-1779218664589-xdr9t1/resume` |
| 8 | 19:24:24.591 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 7
}
```

</details>

<details><summary>4. Recv sql:sqlite_master</summary>

```json
{
  "name": "jobs"
}
```

</details>

<details><summary>5. Recv sql:jobs</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 2
}
```

</details>

---

## cancel from queued state

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.591 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.591 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":8}` |
| 3 | 19:24:24.592 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.592 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664591-vhegq0","description":"Cancel queued"}` |
| 5 | 19:24:24.592 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 8
}
```

</details>

---

## cancel from running state

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.593 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.593 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":9}` |
| 3 | 19:24:24.597 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.597 | Recv | sql:sqlite_master | `{"name":"jobs"}` |
| 5 | 19:24:24.597 | Recv | sql:jobs | `{"changes":1,"lastInsertRowid":3}` |
| 6 | 19:24:24.598 | Send | sql.fixture | `1 rows` |
| 7 | 19:24:24.598 | Send | http.send | `POST /api/v1/jobs/test-1779218664597-92e2uw/cancel` |
| 8 | 19:24:24.598 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 9
}
```

</details>

<details><summary>4. Recv sql:sqlite_master</summary>

```json
{
  "name": "jobs"
}
```

</details>

<details><summary>5. Recv sql:jobs</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 3
}
```

</details>

---

## cannot resume cancelled job

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.599 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.599 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":10}` |
| 3 | 19:24:24.600 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.600 | Recv | sql:sqlite_master | `{"name":"jobs"}` |
| 5 | 19:24:24.600 | Recv | sql:jobs | `{"changes":1,"lastInsertRowid":4}` |
| 6 | 19:24:24.601 | Send | sql.fixture | `1 rows` |
| 7 | 19:24:24.601 | Send | http.send | `POST /api/v1/jobs/test-1779218664600-ko5p9g/resume` |
| 8 | 19:24:24.605 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 10
}
```

</details>

<details><summary>4. Recv sql:sqlite_master</summary>

```json
{
  "name": "jobs"
}
```

</details>

<details><summary>5. Recv sql:jobs</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 4
}
```

</details>

---

## create worker returns worker_id

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.605 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.605 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":11}` |
| 3 | 19:24:24.607 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.607 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664605-cbl4lx","description":"Worker create test"}` |
| 5 | 19:24:24.618 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 11
}
```

</details>

---

## get job config returns resolved stage info

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.618 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.618 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":12}` |
| 3 | 19:24:24.620 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.620 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664618-aw76oi","description":"Config test"}` |
| 5 | 19:24:24.620 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 12
}
```

</details>

---

## get skill content returns markdown

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.621 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.621 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":13}` |
| 3 | 19:24:24.622 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.622 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664621-xi1uf4","description":"Skill test"}` |
| 5 | 19:24:24.622 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 13
}
```

</details>

---

## creates project via SQL seed and reads via HTTP and SQL

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.624 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.624 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":14}` |
| 3 | 19:24:24.628 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.628 | Send | http.send | `GET /api/v1/projects` |
| 5 | 19:24:24.628 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 14
}
```

</details>

---

## creates job via HTTP, verifies via HTTP and SQL

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.629 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.629 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":15}` |
| 3 | 19:24:24.630 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.630 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664629-lfiqc8","description":"DB test job"}` |
| 5 | 19:24:24.630 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 15
}
```

</details>

---

## creates worker record in DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.630 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.630 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":16}` |
| 3 | 19:24:24.631 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.631 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664630-0yaxt8","description":"Worker DB test"}` |
| 5 | 19:24:24.631 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 16
}
```

</details>

---

## create project → create job → verify via HTTP and SQL

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.635 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.635 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":18}` |
| 3 | 19:24:24.636 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.636 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664635-08hdyo","description":"Full lifecycle test"}` |
| 5 | 19:24:24.636 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 18
}
```

</details>

---

## lists jobs and workers via HTTP matches DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.636 | Send | http.send | `GET /api/v1/jobs` |
| 2 | 19:24:24.636 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

---

## validates workflow YAML

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.637 | Send | http.send | `POST /api/v1/workflows/validate {"content":"\nname: test\nstages:\n plan:\n skill: plan\n prompt: \"Plan: {{input}}\"\n tools: [bash]\n routes: null\n"}` |
| 2 | 19:24:24.637 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

---

## rejects invalid workflow YAML

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.637 | Send | http.send | `POST /api/v1/workflows/validate {"content":"name: bad\nstages: {}\n"}` |
| 2 | 19:24:24.637 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

---

## validates numeric routing workflow

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.638 | Send | http.send | `POST /api/v1/workflows/validate {"content":"\nname: numeric-route\ndescription: \"Numeric routing\"\nstages:\n check:\n skill: plan\n prompt: \"Check\"\n tools: [bash]\n max_tokens: 8000\n routes:\...` |
| 2 | 19:24:24.638 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

---

## rejects workflow with empty stages

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.638 | Send | http.send | `POST /api/v1/workflows/validate {"content":"name: bad\nstages: {}\n"}` |
| 2 | 19:24:24.638 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

---

## parses valid workflow YAML

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.639 | Send | http.send | `POST /api/v1/workflows/validate {"content":"\nname: simple\ndescription: \"Simple workflow\"\nstages:\n plan:\n skill: plan\n prompt: \"Plan: {{input}}\"\n tools: [bash, read]\n max_tokens: 8000\n ...` |
| 2 | 19:24:24.639 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

---

## rejects empty stages

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.639 | Send | http.send | `POST /api/v1/workflows/validate {"content":"\nname: empty\ndescription: \"No stages\"\nstages: {}\n"}` |
| 2 | 19:24:24.639 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

---

## accepts single-stage workflow

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.639 | Send | http.send | `POST /api/v1/workflows/validate {"content":"\nname: minimal\ndescription: \"One stage\"\nstages:\n work:\n prompt: \"Do it\"\n tools: [bash]\n max_tokens: 4000\n routes: null\n"}` |
| 2 | 19:24:24.639 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

---

## job with workflow has workflow_name set

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.642 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.642 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":20}` |
| 3 | 19:24:24.643 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.643 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664642-kbb4sw","description":"Workflow job","workflow":"feature"}` |
| 5 | 19:24:24.643 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 20
}
```

</details>

---

## job config resolves {{input}} in prompt

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.644 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.644 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":21}` |
| 3 | 19:24:24.646 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.646 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664644-jzks3k","description":"Add a hello world function","workflow":"simple"}` |
| 5 | 19:24:24.646 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 21
}
```

</details>

---

## job config returns stage and tools

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.646 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.646 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":22}` |
| 3 | 19:24:24.647 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.647 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664646-vh78xb","description":"Build feature X","workflow":"feature"}` |
| 5 | 19:24:24.648 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 22
}
```

</details>

---

## job config returns skill content for plan skill

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.648 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 2 | 19:24:24.648 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":23}` |
| 3 | 19:24:24.649 | Send | sql.fixture | `1 rows` |
| 4 | 19:24:24.649 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664648-7gj8zp","description":"Plan the feature","workflow":"simple"}` |
| 5 | 19:24:24.649 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>2. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 23
}
```

</details>

---

## workflow seeded in DB is accessible via config

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 19:24:24.649 | Recv | sql:sqlite_master | `{"name":"workflows"}` |
| 2 | 19:24:24.649 | Recv | sql:workflows | `[{"name":"simple","content":"name: simple\ndescription: \"Simple two-stage workflow for testing\"\nstages:\n plan:\n skill: plan\n prompt: \"Plan: {{input}}\"\n tools: [bash, read, glob, grep]\n max_tokens: 8000\n routes:\n - when: 'response.complexity == \"simple\"'\n next: done\n - when: 'true'...` |
| 3 | 19:24:24.650 | Recv | sql:sqlite_master | `{"name":"projects"}` |
| 4 | 19:24:24.650 | Recv | sql:projects | `{"changes":1,"lastInsertRowid":24}` |
| 5 | 19:24:24.651 | Send | sql.fixture | `1 rows` |
| 6 | 19:24:24.651 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1779218664649-vym2kl","description":"Test","workflow":"simple"}` |
| 7 | 19:24:24.651 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

<details><summary>1. Recv sql:sqlite_master</summary>

```json
{
  "name": "workflows"
}
```

</details>

<details><summary>2. Recv sql:workflows</summary>

```json
[
  {
    "name": "simple",
    "content": "name: simple\ndescription: \"Simple two-stage workflow for testing\"\nstages:\n  plan:\n    skill: plan\n    prompt: \"Plan: {{input}}\"\n    tools: [bash, read, glob, grep]\n    max_tokens: 8000\n    routes:\n      - when: 'response.complexity == \"simple\"'\n        next: done\n      - when: 'true'\n        next: done\n  done:\n    skill: pause\n    prompt: \"Done\"\n    routes: null\n",
    "source": "builtin",
    "project_id": null,
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-01T00:00:00Z"
  }
]
```

</details>

<details><summary>3. Recv sql:sqlite_master</summary>

```json
{
  "name": "projects"
}
```

</details>

<details><summary>4. Recv sql:projects</summary>

```json
{
  "changes": 1,
  "lastInsertRowid": 24
}
```

</details>

---

