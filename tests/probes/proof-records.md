# Trailhead E2E Test Suite

**Date:** 2026-05-14T20:25:28.037Z
**Events:** 470
**Duration:** 775ms

---

## (setup)

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.300 | Send | sql.clear | `all tables` |
| 2 | 20:25:27.309 | Send | sql.put | `2 rows` |
| 3 | 20:25:27.333 | Send | sql.clear | `all tables` |
| 4 | 20:25:27.343 | Send | sql.put | `2 rows` |
| 5 | 20:25:27.586 | Send | sql.put | `1 rows` |
| 6 | 20:25:27.587 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327585-b3o8c3","description":"Hello world test"}` |
| 7 | 20:25:27.589 | Response | http response | `200 {"job_id":"b4797e27-07cb-4778-bf3e-2d979b9a38e2"}` |

---

## lists jobs via HTTP matching DB count

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.313 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.315 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327311-d1olhe","description":"Job 1"}` |
| 3 | 20:25:27.318 | Recv | sql:jobs | `{"id":"571d16e9-75fa-4986-bbab-f3490aaa0b22","project_id":"test-1778790327311-d1olhe","description":"Job 1","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"2026-05...` |
| 4 | 20:25:27.320 | Response | http response | `200 {"job_id":"571d16e9-75fa-4986-bbab-f3490aaa0b22"}` |
| 5 | 20:25:27.320 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327311-d1olhe","description":"Job 2"}` |
| 6 | 20:25:27.320 | Recv | sql:jobs | `{"id":"1d826858-858f-4639-b37f-d21fd2aead8e","project_id":"test-1778790327311-d1olhe","description":"Job 2","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"2026-05...` |
| 7 | 20:25:27.322 | Response | http response | `200 {"job_id":"1d826858-858f-4639-b37f-d21fd2aead8e"}` |
| 8 | 20:25:27.322 | Send | http.send | `GET /api/v1/jobs` |
| 9 | 20:25:27.323 | Response | http response | `200 [{"id":"571d16e9-75fa-4986-bbab-f3490aaa0b22","project_id":"test-1778790327311-d1olhe","description":"Job 1","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"20...` |

---

## list workers via HTTP matching DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.344 | Send | http.send | `GET /api/v1/workers` |
| 2 | 20:25:27.345 | Response | http response | `200 []` |

---

## GET /api/v1/jobs returns list matching DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.349 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.350 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327348-6kaux5","description":"Dashboard test job"}` |
| 3 | 20:25:27.351 | Recv | sql:jobs | `{"id":"00a06c0a-e250-4288-a60f-354918b5ffc6","project_id":"test-1778790327348-6kaux5","description":"Dashboard test job","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created...` |
| 4 | 20:25:27.352 | Response | http response | `200 {"job_id":"00a06c0a-e250-4288-a60f-354918b5ffc6"}` |
| 5 | 20:25:27.352 | Send | http.send | `GET /api/v1/jobs` |
| 6 | 20:25:27.352 | Response | http response | `200 [{"id":"00a06c0a-e250-4288-a60f-354918b5ffc6","project_id":"test-1778790327348-6kaux5","description":"Dashboard test job","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"cr...` |

---

## GET /api/v1/jobs/{id} returns detail matching DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.355 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.355 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327354-a7okim","description":"Detail test"}` |
| 3 | 20:25:27.356 | Recv | sql:jobs | `{"id":"70442434-2c39-4a11-be6b-12a26c9f0e3b","project_id":"test-1778790327354-a7okim","description":"Detail test","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"2...` |
| 4 | 20:25:27.357 | Response | http response | `200 {"job_id":"70442434-2c39-4a11-be6b-12a26c9f0e3b"}` |
| 5 | 20:25:27.357 | Send | http.send | `GET /api/v1/jobs/70442434-2c39-4a11-be6b-12a26c9f0e3b` |
| 6 | 20:25:27.357 | Response | http response | `200 {"id":"70442434-2c39-4a11-be6b-12a26c9f0e3b","project_id":"test-1778790327354-a7okim","description":"Detail test","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at...` |

---

## GET /api/v1/workers returns list matching DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.360 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.361 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327358-j3wriu","description":"Worker list test"}` |
| 3 | 20:25:27.361 | Recv | sql:jobs | `{"id":"bbf43ff7-334d-49b8-a252-ed3a715c3dce","project_id":"test-1778790327358-j3wriu","description":"Worker list test","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_a...` |
| 4 | 20:25:27.362 | Response | http response | `200 {"job_id":"bbf43ff7-334d-49b8-a252-ed3a715c3dce"}` |
| 5 | 20:25:27.362 | Send | http.send | `POST /api/v1/workers {"job_id":"bbf43ff7-334d-49b8-a252-ed3a715c3dce","provider":"test"}` |
| 6 | 20:25:27.362 | Recv | sql:workers | `{"id":"5a06397b-4b5a-4360-8205-5fe235e800e0","job_id":"bbf43ff7-334d-49b8-a252-ed3a715c3dce","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.362703807+00:00","destroyed_at":null}` |
| 7 | 20:25:27.363 | Response | http response | `200 {"worker_id":"5a06397b-4b5a-4360-8205-5fe235e800e0"}` |
| 8 | 20:25:27.363 | Send | http.send | `POST /api/v1/workers/5a06397b-4b5a-4360-8205-5fe235e800e0/register {"job_id":"bbf43ff7-334d-49b8-a252-ed3a715c3dce"}` |
| 9 | 20:25:27.364 | Recv | sql:workers | `{"id":"5a06397b-4b5a-4360-8205-5fe235e800e0","job_id":"bbf43ff7-334d-49b8-a252-ed3a715c3dce","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.362703807+00:00","destroyed_at":null}` |
| 10 | 20:25:27.365 | Recv | sql:jobs | `{"id":"bbf43ff7-334d-49b8-a252-ed3a715c3dce","project_id":"test-1778790327358-j3wriu","description":"Worker list test","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_...` |
| 11 | 20:25:27.366 | Response | http response | `200 ` |
| 12 | 20:25:27.366 | Send | http.send | `GET /api/v1/workers` |
| 13 | 20:25:27.366 | Response | http response | `200 [{"id":"5a06397b-4b5a-4360-8205-5fe235e800e0","job_id":"bbf43ff7-334d-49b8-a252-ed3a715c3dce","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.362703807+00:00","destroyed_at":null}]` |

---

## POST /api/v1/jobs/{id}/pause changes status in DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.369 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.369 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327368-zhrm6u","description":"Pause via dashboard"}` |
| 3 | 20:25:27.370 | Recv | sql:jobs | `{"id":"cef9b12c-400c-43d4-b467-7bf7bca59ae6","project_id":"test-1778790327368-zhrm6u","description":"Pause via dashboard","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"create...` |
| 4 | 20:25:27.371 | Response | http response | `200 {"job_id":"cef9b12c-400c-43d4-b467-7bf7bca59ae6"}` |
| 5 | 20:25:27.371 | Send | http.send | `POST /api/v1/workers {"job_id":"cef9b12c-400c-43d4-b467-7bf7bca59ae6","provider":"test"}` |
| 6 | 20:25:27.371 | Recv | sql:workers | `{"id":"5c77ee69-5f04-4fe2-ab70-542a666157c0","job_id":"cef9b12c-400c-43d4-b467-7bf7bca59ae6","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.371789371+00:00","destroyed_at":null}` |
| 7 | 20:25:27.372 | Response | http response | `200 {"worker_id":"5c77ee69-5f04-4fe2-ab70-542a666157c0"}` |
| 8 | 20:25:27.372 | Send | http.send | `POST /api/v1/workers/5c77ee69-5f04-4fe2-ab70-542a666157c0/register {"job_id":"cef9b12c-400c-43d4-b467-7bf7bca59ae6"}` |
| 9 | 20:25:27.372 | Recv | sql:workers | `{"id":"5c77ee69-5f04-4fe2-ab70-542a666157c0","job_id":"cef9b12c-400c-43d4-b467-7bf7bca59ae6","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.371789371+00:00","destroyed_at":null}` |
| 10 | 20:25:27.373 | Recv | sql:jobs | `{"id":"cef9b12c-400c-43d4-b467-7bf7bca59ae6","project_id":"test-1778790327368-zhrm6u","description":"Pause via dashboard","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"creat...` |
| 11 | 20:25:27.374 | Response | http response | `200 ` |
| 12 | 20:25:27.374 | Send | http.send | `POST /api/v1/jobs/cef9b12c-400c-43d4-b467-7bf7bca59ae6/pause` |
| 13 | 20:25:27.375 | Recv | sql:jobs | `{"id":"cef9b12c-400c-43d4-b467-7bf7bca59ae6","project_id":"test-1778790327368-zhrm6u","description":"Pause via dashboard","status":"paused","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"create...` |
| 14 | 20:25:27.376 | Response | http response | `200 ` |

---

## POST /api/v1/jobs/{id}/cancel changes status in DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.378 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.379 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327377-mj74ov","description":"Cancel via dashboard"}` |
| 3 | 20:25:27.379 | Recv | sql:jobs | `{"id":"ab2c1f58-f189-4503-b07d-a0e67dfa8671","project_id":"test-1778790327377-mj74ov","description":"Cancel via dashboard","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"creat...` |
| 4 | 20:25:27.381 | Response | http response | `200 {"job_id":"ab2c1f58-f189-4503-b07d-a0e67dfa8671"}` |
| 5 | 20:25:27.381 | Send | http.send | `POST /api/v1/jobs/ab2c1f58-f189-4503-b07d-a0e67dfa8671/cancel` |
| 6 | 20:25:27.381 | Recv | sql:jobs | `{"id":"ab2c1f58-f189-4503-b07d-a0e67dfa8671","project_id":"test-1778790327377-mj74ov","description":"Cancel via dashboard","status":"cancelled","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"cr...` |
| 7 | 20:25:27.383 | Response | http response | `200 ` |

---

## new job is queued in DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.387 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.388 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327386-xx2sj2","description":"State machine test"}` |
| 3 | 20:25:27.388 | Recv | sql:jobs | `{"id":"bd3d8287-9883-44f1-82de-13b8f55017a3","project_id":"test-1778790327386-xx2sj2","description":"State machine test","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created...` |
| 4 | 20:25:27.389 | Response | http response | `200 {"job_id":"bd3d8287-9883-44f1-82de-13b8f55017a3"}` |
| 5 | 20:25:27.965 | Send | sql.put | `1 rows` |
| 6 | 20:25:27.966 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327963-dqbgx7","description":"Start at first stage"}` |
| 7 | 20:25:27.967 | Recv | sql:jobs | `{"id":"5fdc359e-fceb-4a1f-8f26-a3437f53e528","project_id":"test-1778790327963-dqbgx7","description":"Start at first stage","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"creat...` |
| 8 | 20:25:27.969 | Response | http response | `200 {"job_id":"5fdc359e-fceb-4a1f-8f26-a3437f53e528"}` |

---

## running to paused via HTTP, verified in DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.391 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.392 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327390-i7p880","description":"Pause test"}` |
| 3 | 20:25:27.392 | Recv | sql:jobs | `{"id":"52e7fddd-cd84-4e56-a203-524f2b6d265d","project_id":"test-1778790327390-i7p880","description":"Pause test","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"20...` |
| 4 | 20:25:27.393 | Response | http response | `200 {"job_id":"52e7fddd-cd84-4e56-a203-524f2b6d265d"}` |
| 5 | 20:25:27.393 | Send | http.send | `POST /api/v1/workers {"job_id":"52e7fddd-cd84-4e56-a203-524f2b6d265d","provider":"test"}` |
| 6 | 20:25:27.393 | Recv | sql:workers | `{"id":"72379d65-49fa-412b-a400-eff84e638fc6","job_id":"52e7fddd-cd84-4e56-a203-524f2b6d265d","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.393596897+00:00","destroyed_at":null}` |
| 7 | 20:25:27.394 | Response | http response | `200 {"worker_id":"72379d65-49fa-412b-a400-eff84e638fc6"}` |
| 8 | 20:25:27.394 | Send | http.send | `POST /api/v1/workers/72379d65-49fa-412b-a400-eff84e638fc6/register {"job_id":"52e7fddd-cd84-4e56-a203-524f2b6d265d"}` |
| 9 | 20:25:27.395 | Recv | sql:workers | `{"id":"72379d65-49fa-412b-a400-eff84e638fc6","job_id":"52e7fddd-cd84-4e56-a203-524f2b6d265d","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.393596897+00:00","destroyed_at":null}` |
| 10 | 20:25:27.395 | Recv | sql:jobs | `{"id":"52e7fddd-cd84-4e56-a203-524f2b6d265d","project_id":"test-1778790327390-i7p880","description":"Pause test","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"2...` |
| 11 | 20:25:27.396 | Response | http response | `200 ` |
| 12 | 20:25:27.396 | Send | http.send | `POST /api/v1/jobs/52e7fddd-cd84-4e56-a203-524f2b6d265d/pause` |
| 13 | 20:25:27.397 | Recv | sql:jobs | `{"id":"52e7fddd-cd84-4e56-a203-524f2b6d265d","project_id":"test-1778790327390-i7p880","description":"Pause test","status":"paused","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"20...` |
| 14 | 20:25:27.398 | Response | http response | `200 ` |

---

## paused to resuming via HTTP, verified in DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.400 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.401 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327399-c3u26h","description":"Resume test"}` |
| 3 | 20:25:27.401 | Recv | sql:jobs | `{"id":"7395c03b-e8a4-40b0-9301-0720474772d4","project_id":"test-1778790327399-c3u26h","description":"Resume test","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"2...` |
| 4 | 20:25:27.402 | Response | http response | `200 {"job_id":"7395c03b-e8a4-40b0-9301-0720474772d4"}` |
| 5 | 20:25:27.402 | Send | http.send | `POST /api/v1/workers {"job_id":"7395c03b-e8a4-40b0-9301-0720474772d4","provider":"test"}` |
| 6 | 20:25:27.402 | Recv | sql:workers | `{"id":"a4b2e5ef-4098-4007-a325-d1458831b379","job_id":"7395c03b-e8a4-40b0-9301-0720474772d4","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.402907471+00:00","destroyed_at":null}` |
| 7 | 20:25:27.403 | Response | http response | `200 {"worker_id":"a4b2e5ef-4098-4007-a325-d1458831b379"}` |
| 8 | 20:25:27.403 | Send | http.send | `POST /api/v1/workers/a4b2e5ef-4098-4007-a325-d1458831b379/register {"job_id":"7395c03b-e8a4-40b0-9301-0720474772d4"}` |
| 9 | 20:25:27.403 | Recv | sql:workers | `{"id":"a4b2e5ef-4098-4007-a325-d1458831b379","job_id":"7395c03b-e8a4-40b0-9301-0720474772d4","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.402907471+00:00","destroyed_at":null}` |
| 10 | 20:25:27.404 | Recv | sql:jobs | `{"id":"7395c03b-e8a4-40b0-9301-0720474772d4","project_id":"test-1778790327399-c3u26h","description":"Resume test","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"...` |
| 11 | 20:25:27.405 | Response | http response | `200 ` |
| 12 | 20:25:27.405 | Send | http.send | `POST /api/v1/jobs/7395c03b-e8a4-40b0-9301-0720474772d4/pause` |
| 13 | 20:25:27.405 | Recv | sql:jobs | `{"id":"7395c03b-e8a4-40b0-9301-0720474772d4","project_id":"test-1778790327399-c3u26h","description":"Resume test","status":"paused","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"2...` |
| 14 | 20:25:27.406 | Response | http response | `200 ` |
| 15 | 20:25:27.406 | Send | http.send | `POST /api/v1/jobs/7395c03b-e8a4-40b0-9301-0720474772d4/resume` |
| 16 | 20:25:27.406 | Recv | sql:jobs | `{"id":"7395c03b-e8a4-40b0-9301-0720474772d4","project_id":"test-1778790327399-c3u26h","description":"Resume test","status":"resuming","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":...` |
| 17 | 20:25:27.407 | Response | http response | `200 ` |

---

## running to completed, verified in DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.409 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.410 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327408-ti9d5e","description":"Complete test"}` |
| 3 | 20:25:27.410 | Recv | sql:jobs | `{"id":"6dee3c7c-816d-43e3-a2eb-23531fb4dbb6","project_id":"test-1778790327408-ti9d5e","description":"Complete test","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":...` |
| 4 | 20:25:27.412 | Response | http response | `200 {"job_id":"6dee3c7c-816d-43e3-a2eb-23531fb4dbb6"}` |
| 5 | 20:25:27.412 | Send | http.send | `POST /api/v1/workers {"job_id":"6dee3c7c-816d-43e3-a2eb-23531fb4dbb6","provider":"test"}` |
| 6 | 20:25:27.412 | Recv | sql:workers | `{"id":"cb53940b-d898-437e-8c9a-ebda83b8bda3","job_id":"6dee3c7c-816d-43e3-a2eb-23531fb4dbb6","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.412584836+00:00","destroyed_at":null}` |
| 7 | 20:25:27.413 | Response | http response | `200 {"worker_id":"cb53940b-d898-437e-8c9a-ebda83b8bda3"}` |
| 8 | 20:25:27.413 | Send | http.send | `POST /api/v1/workers/cb53940b-d898-437e-8c9a-ebda83b8bda3/register {"job_id":"6dee3c7c-816d-43e3-a2eb-23531fb4dbb6"}` |
| 9 | 20:25:27.413 | Recv | sql:workers | `{"id":"cb53940b-d898-437e-8c9a-ebda83b8bda3","job_id":"6dee3c7c-816d-43e3-a2eb-23531fb4dbb6","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.412584836+00:00","destroyed_at":null}` |
| 10 | 20:25:27.414 | Recv | sql:jobs | `{"id":"6dee3c7c-816d-43e3-a2eb-23531fb4dbb6","project_id":"test-1778790327408-ti9d5e","description":"Complete test","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at"...` |
| 11 | 20:25:27.415 | Response | http response | `200 ` |
| 12 | 20:25:27.415 | Send | http.send | `POST /api/v1/workers/cb53940b-d898-437e-8c9a-ebda83b8bda3/complete {"result":"success"}` |
| 13 | 20:25:27.415 | Recv | sql:jobs | `{"id":"6dee3c7c-816d-43e3-a2eb-23531fb4dbb6","project_id":"test-1778790327408-ti9d5e","description":"Complete test","status":"completed","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":"success","error":null,"crea...` |
| 14 | 20:25:27.416 | Recv | sql:workers | `{"id":"cb53940b-d898-437e-8c9a-ebda83b8bda3","job_id":"6dee3c7c-816d-43e3-a2eb-23531fb4dbb6","provider":"test","provider_id":null,"status":"stopped","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.412584836+00:00","destroyed_at":"2026-05-14T20:25:27.4...` |
| 15 | 20:25:27.417 | Response | http response | `200 ` |

---

## running to failed_retryable, verified in DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.419 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.420 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327418-9yhm7u","description":"Fail test"}` |
| 3 | 20:25:27.420 | Recv | sql:jobs | `{"id":"8983841b-cb0f-462f-9bcb-240a94c01e28","project_id":"test-1778790327418-9yhm7u","description":"Fail test","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"202...` |
| 4 | 20:25:27.421 | Response | http response | `200 {"job_id":"8983841b-cb0f-462f-9bcb-240a94c01e28"}` |
| 5 | 20:25:27.421 | Send | http.send | `POST /api/v1/workers {"job_id":"8983841b-cb0f-462f-9bcb-240a94c01e28","provider":"test"}` |
| 6 | 20:25:27.421 | Recv | sql:workers | `{"id":"d0377f9c-92d0-4d0a-bf52-1a419e78fce2","job_id":"8983841b-cb0f-462f-9bcb-240a94c01e28","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.421625663+00:00","destroyed_at":null}` |
| 7 | 20:25:27.422 | Response | http response | `200 {"worker_id":"d0377f9c-92d0-4d0a-bf52-1a419e78fce2"}` |
| 8 | 20:25:27.422 | Send | http.send | `POST /api/v1/workers/d0377f9c-92d0-4d0a-bf52-1a419e78fce2/register {"job_id":"8983841b-cb0f-462f-9bcb-240a94c01e28"}` |
| 9 | 20:25:27.422 | Recv | sql:workers | `{"id":"d0377f9c-92d0-4d0a-bf52-1a419e78fce2","job_id":"8983841b-cb0f-462f-9bcb-240a94c01e28","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.421625663+00:00","destroyed_at":null}` |
| 10 | 20:25:27.423 | Recv | sql:jobs | `{"id":"8983841b-cb0f-462f-9bcb-240a94c01e28","project_id":"test-1778790327418-9yhm7u","description":"Fail test","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"20...` |
| 11 | 20:25:27.424 | Response | http response | `200 ` |
| 12 | 20:25:27.424 | Send | http.send | `POST /api/v1/workers/d0377f9c-92d0-4d0a-bf52-1a419e78fce2/fail {"error":"transient failure"}` |
| 13 | 20:25:27.424 | Recv | sql:jobs | `{"id":"8983841b-cb0f-462f-9bcb-240a94c01e28","project_id":"test-1778790327418-9yhm7u","description":"Fail test","status":"failed_retryable","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":"transient f...` |
| 14 | 20:25:27.425 | Recv | sql:workers | `{"id":"d0377f9c-92d0-4d0a-bf52-1a419e78fce2","job_id":"8983841b-cb0f-462f-9bcb-240a94c01e28","provider":"test","provider_id":null,"status":"stopped","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.421625663+00:00","destroyed_at":"2026-05-14T20:25:27.4...` |
| 15 | 20:25:27.426 | Response | http response | `200 ` |

---

## cannot resume completed job

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.428 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.429 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327427-tbuyse","description":"Terminal test"}` |
| 3 | 20:25:27.429 | Recv | sql:jobs | `{"id":"a8e5f7a4-9874-4418-828a-5a1805b69f08","project_id":"test-1778790327427-tbuyse","description":"Terminal test","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":...` |
| 4 | 20:25:27.431 | Response | http response | `200 {"job_id":"a8e5f7a4-9874-4418-828a-5a1805b69f08"}` |
| 5 | 20:25:27.431 | Send | http.send | `POST /api/v1/workers {"job_id":"a8e5f7a4-9874-4418-828a-5a1805b69f08","provider":"test"}` |
| 6 | 20:25:27.431 | Recv | sql:workers | `{"id":"1c78bd0b-e72d-4174-8769-3e64462503ad","job_id":"a8e5f7a4-9874-4418-828a-5a1805b69f08","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.431590522+00:00","destroyed_at":null}` |
| 7 | 20:25:27.432 | Response | http response | `200 {"worker_id":"1c78bd0b-e72d-4174-8769-3e64462503ad"}` |
| 8 | 20:25:27.432 | Send | http.send | `POST /api/v1/workers/1c78bd0b-e72d-4174-8769-3e64462503ad/register {"job_id":"a8e5f7a4-9874-4418-828a-5a1805b69f08"}` |
| 9 | 20:25:27.432 | Recv | sql:workers | `{"id":"1c78bd0b-e72d-4174-8769-3e64462503ad","job_id":"a8e5f7a4-9874-4418-828a-5a1805b69f08","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.431590522+00:00","destroyed_at":null}` |
| 10 | 20:25:27.433 | Recv | sql:jobs | `{"id":"a8e5f7a4-9874-4418-828a-5a1805b69f08","project_id":"test-1778790327427-tbuyse","description":"Terminal test","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at"...` |
| 11 | 20:25:27.434 | Response | http response | `200 ` |
| 12 | 20:25:27.434 | Send | http.send | `POST /api/v1/workers/1c78bd0b-e72d-4174-8769-3e64462503ad/complete {"result":"done"}` |
| 13 | 20:25:27.434 | Recv | sql:jobs | `{"id":"a8e5f7a4-9874-4418-828a-5a1805b69f08","project_id":"test-1778790327427-tbuyse","description":"Terminal test","status":"completed","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":"done","error":null,"created...` |
| 14 | 20:25:27.435 | Recv | sql:workers | `{"id":"1c78bd0b-e72d-4174-8769-3e64462503ad","job_id":"a8e5f7a4-9874-4418-828a-5a1805b69f08","provider":"test","provider_id":null,"status":"stopped","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.431590522+00:00","destroyed_at":"2026-05-14T20:25:27.4...` |
| 15 | 20:25:27.436 | Response | http response | `200 ` |
| 16 | 20:25:27.436 | Send | http.send | `POST /api/v1/jobs/a8e5f7a4-9874-4418-828a-5a1805b69f08/resume` |
| 17 | 20:25:27.436 | Response | http response | `409 invalid transition: completed -> resuming` |

---

## cancel from queued state

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.438 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.439 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327437-n6ngqd","description":"Cancel queued"}` |
| 3 | 20:25:27.439 | Recv | sql:jobs | `{"id":"957c841d-5113-4504-b312-5d77cf53cc6c","project_id":"test-1778790327437-n6ngqd","description":"Cancel queued","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":...` |
| 4 | 20:25:27.440 | Response | http response | `200 {"job_id":"957c841d-5113-4504-b312-5d77cf53cc6c"}` |
| 5 | 20:25:27.440 | Send | http.send | `POST /api/v1/jobs/957c841d-5113-4504-b312-5d77cf53cc6c/cancel` |
| 6 | 20:25:27.440 | Recv | sql:jobs | `{"id":"957c841d-5113-4504-b312-5d77cf53cc6c","project_id":"test-1778790327437-n6ngqd","description":"Cancel queued","status":"cancelled","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_a...` |
| 7 | 20:25:27.441 | Response | http response | `200 ` |

---

## cancel from running state

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.443 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.444 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327442-se98lw","description":"Cancel running"}` |
| 3 | 20:25:27.445 | Recv | sql:jobs | `{"id":"1292c55a-e7e9-495a-acda-2842d9ad4c2b","project_id":"test-1778790327442-se98lw","description":"Cancel running","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at"...` |
| 4 | 20:25:27.446 | Response | http response | `200 {"job_id":"1292c55a-e7e9-495a-acda-2842d9ad4c2b"}` |
| 5 | 20:25:27.446 | Send | http.send | `POST /api/v1/workers {"job_id":"1292c55a-e7e9-495a-acda-2842d9ad4c2b","provider":"test"}` |
| 6 | 20:25:27.447 | Recv | sql:workers | `{"id":"63679fee-ee40-4e47-babb-15de7f18d365","job_id":"1292c55a-e7e9-495a-acda-2842d9ad4c2b","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.447102745+00:00","destroyed_at":null}` |
| 7 | 20:25:27.448 | Response | http response | `200 {"worker_id":"63679fee-ee40-4e47-babb-15de7f18d365"}` |
| 8 | 20:25:27.448 | Send | http.send | `POST /api/v1/workers/63679fee-ee40-4e47-babb-15de7f18d365/register {"job_id":"1292c55a-e7e9-495a-acda-2842d9ad4c2b"}` |
| 9 | 20:25:27.448 | Recv | sql:workers | `{"id":"63679fee-ee40-4e47-babb-15de7f18d365","job_id":"1292c55a-e7e9-495a-acda-2842d9ad4c2b","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.447102745+00:00","destroyed_at":null}` |
| 10 | 20:25:27.449 | Recv | sql:jobs | `{"id":"1292c55a-e7e9-495a-acda-2842d9ad4c2b","project_id":"test-1778790327442-se98lw","description":"Cancel running","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at...` |
| 11 | 20:25:27.450 | Response | http response | `200 ` |
| 12 | 20:25:27.450 | Send | http.send | `POST /api/v1/jobs/1292c55a-e7e9-495a-acda-2842d9ad4c2b/cancel` |
| 13 | 20:25:27.451 | Recv | sql:jobs | `{"id":"1292c55a-e7e9-495a-acda-2842d9ad4c2b","project_id":"test-1778790327442-se98lw","description":"Cancel running","status":"cancelled","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_...` |
| 14 | 20:25:27.452 | Response | http response | `200 ` |

---

## worker register sets job to running in DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.456 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.457 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327455-mmnsy8","description":"E2E test job"}` |
| 3 | 20:25:27.458 | Recv | sql:jobs | `{"id":"0414fb77-ec07-4715-a979-54cb966eee59","project_id":"test-1778790327455-mmnsy8","description":"E2E test job","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"...` |
| 4 | 20:25:27.459 | Response | http response | `200 {"job_id":"0414fb77-ec07-4715-a979-54cb966eee59"}` |
| 5 | 20:25:27.459 | Send | http.send | `POST /api/v1/workers {"job_id":"0414fb77-ec07-4715-a979-54cb966eee59","provider":"test"}` |
| 6 | 20:25:27.459 | Recv | sql:workers | `{"id":"24592f00-fc83-4458-9173-3c827e0cfc16","job_id":"0414fb77-ec07-4715-a979-54cb966eee59","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.459838608+00:00","destroyed_at":null}` |
| 7 | 20:25:27.461 | Response | http response | `200 {"worker_id":"24592f00-fc83-4458-9173-3c827e0cfc16"}` |
| 8 | 20:25:27.461 | Send | http.send | `POST /api/v1/workers/24592f00-fc83-4458-9173-3c827e0cfc16/register {"job_id":"0414fb77-ec07-4715-a979-54cb966eee59"}` |
| 9 | 20:25:27.461 | Recv | sql:workers | `{"id":"24592f00-fc83-4458-9173-3c827e0cfc16","job_id":"0414fb77-ec07-4715-a979-54cb966eee59","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.459838608+00:00","destroyed_at":null}` |
| 10 | 20:25:27.463 | Recv | sql:jobs | `{"id":"0414fb77-ec07-4715-a979-54cb966eee59","project_id":"test-1778790327455-mmnsy8","description":"E2E test job","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":...` |
| 11 | 20:25:27.464 | Response | http response | `200 ` |

---

## worker heartbeat updates timestamp in DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.468 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.469 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327466-mrum12","description":"E2E test job"}` |
| 3 | 20:25:27.469 | Recv | sql:jobs | `{"id":"e09ce1e5-a318-40b3-83cd-eb6c22fb4d2c","project_id":"test-1778790327466-mrum12","description":"E2E test job","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"...` |
| 4 | 20:25:27.470 | Response | http response | `200 {"job_id":"e09ce1e5-a318-40b3-83cd-eb6c22fb4d2c"}` |
| 5 | 20:25:27.470 | Send | http.send | `POST /api/v1/workers {"job_id":"e09ce1e5-a318-40b3-83cd-eb6c22fb4d2c","provider":"test"}` |
| 6 | 20:25:27.471 | Recv | sql:workers | `{"id":"c19e96cc-b149-438f-9bc6-14a2e90ddabf","job_id":"e09ce1e5-a318-40b3-83cd-eb6c22fb4d2c","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.471025297+00:00","destroyed_at":null}` |
| 7 | 20:25:27.472 | Response | http response | `200 {"worker_id":"c19e96cc-b149-438f-9bc6-14a2e90ddabf"}` |
| 8 | 20:25:27.472 | Send | http.send | `POST /api/v1/workers/c19e96cc-b149-438f-9bc6-14a2e90ddabf/register {"job_id":"e09ce1e5-a318-40b3-83cd-eb6c22fb4d2c"}` |
| 9 | 20:25:27.472 | Recv | sql:workers | `{"id":"c19e96cc-b149-438f-9bc6-14a2e90ddabf","job_id":"e09ce1e5-a318-40b3-83cd-eb6c22fb4d2c","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.471025297+00:00","destroyed_at":null}` |
| 10 | 20:25:27.473 | Recv | sql:jobs | `{"id":"e09ce1e5-a318-40b3-83cd-eb6c22fb4d2c","project_id":"test-1778790327466-mrum12","description":"E2E test job","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":...` |
| 11 | 20:25:27.474 | Response | http response | `200 ` |
| 12 | 20:25:27.474 | Send | http.send | `POST /api/v1/workers/c19e96cc-b149-438f-9bc6-14a2e90ddabf/heartbeat {"status":"running","current_stage":"plan","token_usage":{"prompt_tokens":500,"completion_tokens":200},"files_changed":0,"tool_ca...` |
| 13 | 20:25:27.474 | Recv | sql:workers | `{"id":"c19e96cc-b149-438f-9bc6-14a2e90ddabf","job_id":"e09ce1e5-a318-40b3-83cd-eb6c22fb4d2c","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":"2026-05-14T20:25:27.474882727+00:00","created_at":"2026-05-14T20:25:27.471025297+00:00","des...` |
| 14 | 20:25:27.475 | Response | http response | `200 ` |

---

## worker checkpoint writes to jobs and checkpoints tables

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.478 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.479 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327477-kb3ysw","description":"E2E test job"}` |
| 3 | 20:25:27.480 | Recv | sql:jobs | `{"id":"e00e9622-c4ca-49ad-acd9-0cbc4b930424","project_id":"test-1778790327477-kb3ysw","description":"E2E test job","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"...` |
| 4 | 20:25:27.481 | Response | http response | `200 {"job_id":"e00e9622-c4ca-49ad-acd9-0cbc4b930424"}` |
| 5 | 20:25:27.481 | Send | http.send | `POST /api/v1/workers {"job_id":"e00e9622-c4ca-49ad-acd9-0cbc4b930424","provider":"test"}` |
| 6 | 20:25:27.481 | Recv | sql:workers | `{"id":"de684009-60f4-4807-8cb6-07de3b39ca6b","job_id":"e00e9622-c4ca-49ad-acd9-0cbc4b930424","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.481704301+00:00","destroyed_at":null}` |
| 7 | 20:25:27.483 | Response | http response | `200 {"worker_id":"de684009-60f4-4807-8cb6-07de3b39ca6b"}` |
| 8 | 20:25:27.483 | Send | http.send | `POST /api/v1/workers/de684009-60f4-4807-8cb6-07de3b39ca6b/register {"job_id":"e00e9622-c4ca-49ad-acd9-0cbc4b930424"}` |
| 9 | 20:25:27.483 | Recv | sql:workers | `{"id":"de684009-60f4-4807-8cb6-07de3b39ca6b","job_id":"e00e9622-c4ca-49ad-acd9-0cbc4b930424","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.481704301+00:00","destroyed_at":null}` |
| 10 | 20:25:27.484 | Recv | sql:jobs | `{"id":"e00e9622-c4ca-49ad-acd9-0cbc4b930424","project_id":"test-1778790327477-kb3ysw","description":"E2E test job","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":...` |
| 11 | 20:25:27.485 | Response | http response | `200 ` |
| 12 | 20:25:27.485 | Send | http.send | `POST /api/v1/workers/de684009-60f4-4807-8cb6-07de3b39ca6b/checkpoint {"stage":"plan","response":{"complexity":"simple"},"session_path":"/tmp/session.json","git_sha":"def456","token_usage":{"prompt_...` |
| 13 | 20:25:27.486 | Recv | sql:checkpoints | `{"id":"a60ae175-f106-47f2-a853-db1606eed666","job_id":"e00e9622-c4ca-49ad-acd9-0cbc4b930424","stage":"plan","response":"{\"complexity\":\"simple\"}","session_path":"/tmp/session.json","git_sha":"def456","token_usage":"{\"prompt_tokens\":100,\"completion_tokens\":50}","files_changed":"[\"src/lib.r...` |
| 14 | 20:25:27.487 | Recv | sql:jobs | `{"id":"e00e9622-c4ca-49ad-acd9-0cbc4b930424","project_id":"test-1778790327477-kb3ysw","description":"E2E test job","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":"implement","stage_history":"[{\"stage\":\"plan\",\"status\":\"completed\"}]","attempt":1,"max_...` |
| 15 | 20:25:27.488 | Response | http response | `200 ` |

---

## worker complete sets result and destroys worker

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.492 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.494 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327491-0v792m","description":"E2E test job"}` |
| 3 | 20:25:27.495 | Recv | sql:jobs | `{"id":"675f3acf-7d49-4db8-b82c-20ddc77956aa","project_id":"test-1778790327491-0v792m","description":"E2E test job","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"...` |
| 4 | 20:25:27.496 | Response | http response | `200 {"job_id":"675f3acf-7d49-4db8-b82c-20ddc77956aa"}` |
| 5 | 20:25:27.497 | Send | http.send | `POST /api/v1/workers {"job_id":"675f3acf-7d49-4db8-b82c-20ddc77956aa","provider":"test"}` |
| 6 | 20:25:27.497 | Recv | sql:workers | `{"id":"944b5cd7-ffba-4b3e-9aa8-9d3194a66784","job_id":"675f3acf-7d49-4db8-b82c-20ddc77956aa","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.497213701+00:00","destroyed_at":null}` |
| 7 | 20:25:27.498 | Response | http response | `200 {"worker_id":"944b5cd7-ffba-4b3e-9aa8-9d3194a66784"}` |
| 8 | 20:25:27.498 | Send | http.send | `POST /api/v1/workers/944b5cd7-ffba-4b3e-9aa8-9d3194a66784/register {"job_id":"675f3acf-7d49-4db8-b82c-20ddc77956aa"}` |
| 9 | 20:25:27.498 | Recv | sql:workers | `{"id":"944b5cd7-ffba-4b3e-9aa8-9d3194a66784","job_id":"675f3acf-7d49-4db8-b82c-20ddc77956aa","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.497213701+00:00","destroyed_at":null}` |
| 10 | 20:25:27.500 | Recv | sql:jobs | `{"id":"675f3acf-7d49-4db8-b82c-20ddc77956aa","project_id":"test-1778790327491-0v792m","description":"E2E test job","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":...` |
| 11 | 20:25:27.501 | Response | http response | `200 ` |
| 12 | 20:25:27.501 | Send | http.send | `POST /api/v1/workers/944b5cd7-ffba-4b3e-9aa8-9d3194a66784/complete {"result":"success"}` |
| 13 | 20:25:27.502 | Recv | sql:jobs | `{"id":"675f3acf-7d49-4db8-b82c-20ddc77956aa","project_id":"test-1778790327491-0v792m","description":"E2E test job","status":"completed","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":"success","error":null,"creat...` |
| 14 | 20:25:27.503 | Recv | sql:workers | `{"id":"944b5cd7-ffba-4b3e-9aa8-9d3194a66784","job_id":"675f3acf-7d49-4db8-b82c-20ddc77956aa","provider":"test","provider_id":null,"status":"stopped","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.497213701+00:00","destroyed_at":"2026-05-14T20:25:27.5...` |
| 15 | 20:25:27.504 | Response | http response | `200 ` |

---

## worker fail sets error in DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.508 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.509 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327506-1s2ngn","description":"E2E test job"}` |
| 3 | 20:25:27.510 | Recv | sql:jobs | `{"id":"7ca69819-a6d3-47fa-a715-2d7ac23a97c7","project_id":"test-1778790327506-1s2ngn","description":"E2E test job","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"...` |
| 4 | 20:25:27.512 | Response | http response | `200 {"job_id":"7ca69819-a6d3-47fa-a715-2d7ac23a97c7"}` |
| 5 | 20:25:27.512 | Send | http.send | `POST /api/v1/workers {"job_id":"7ca69819-a6d3-47fa-a715-2d7ac23a97c7","provider":"test"}` |
| 6 | 20:25:27.513 | Recv | sql:workers | `{"id":"70d3db98-263f-4940-9ba0-e29c5470da3a","job_id":"7ca69819-a6d3-47fa-a715-2d7ac23a97c7","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.513120009+00:00","destroyed_at":null}` |
| 7 | 20:25:27.514 | Response | http response | `200 {"worker_id":"70d3db98-263f-4940-9ba0-e29c5470da3a"}` |
| 8 | 20:25:27.514 | Send | http.send | `POST /api/v1/workers/70d3db98-263f-4940-9ba0-e29c5470da3a/register {"job_id":"7ca69819-a6d3-47fa-a715-2d7ac23a97c7"}` |
| 9 | 20:25:27.515 | Recv | sql:workers | `{"id":"70d3db98-263f-4940-9ba0-e29c5470da3a","job_id":"7ca69819-a6d3-47fa-a715-2d7ac23a97c7","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.513120009+00:00","destroyed_at":null}` |
| 10 | 20:25:27.516 | Recv | sql:jobs | `{"id":"7ca69819-a6d3-47fa-a715-2d7ac23a97c7","project_id":"test-1778790327506-1s2ngn","description":"E2E test job","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":...` |
| 11 | 20:25:27.517 | Response | http response | `200 ` |
| 12 | 20:25:27.517 | Send | http.send | `POST /api/v1/workers/70d3db98-263f-4940-9ba0-e29c5470da3a/fail {"error":"build failed"}` |
| 13 | 20:25:27.518 | Recv | sql:jobs | `{"id":"7ca69819-a6d3-47fa-a715-2d7ac23a97c7","project_id":"test-1778790327506-1s2ngn","description":"E2E test job","status":"failed_retryable","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":"build fa...` |
| 14 | 20:25:27.519 | Recv | sql:workers | `{"id":"70d3db98-263f-4940-9ba0-e29c5470da3a","job_id":"7ca69819-a6d3-47fa-a715-2d7ac23a97c7","provider":"test","provider_id":null,"status":"stopped","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.513120009+00:00","destroyed_at":"2026-05-14T20:25:27.5...` |
| 15 | 20:25:27.520 | Response | http response | `200 ` |

---

## get job config returns resolved stage info

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.524 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.525 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327522-al0h85","description":"E2E test job"}` |
| 3 | 20:25:27.527 | Response | http response | `200 {"job_id":"7ade0514-cf4d-431d-a8df-c5d894ff0fef"}` |
| 4 | 20:25:27.527 | Send | http.send | `POST /api/v1/workers {"job_id":"7ade0514-cf4d-431d-a8df-c5d894ff0fef","provider":"test"}` |
| 5 | 20:25:27.528 | Response | http response | `200 {"worker_id":"328196a5-86bf-4c8f-8df7-c2061cc655d5"}` |
| 6 | 20:25:27.528 | Send | http.send | `POST /api/v1/workers/328196a5-86bf-4c8f-8df7-c2061cc655d5/register {"job_id":"7ade0514-cf4d-431d-a8df-c5d894ff0fef"}` |
| 7 | 20:25:27.531 | Response | http response | `200 ` |
| 8 | 20:25:27.531 | Send | http.send | `GET /api/v1/jobs/7ade0514-cf4d-431d-a8df-c5d894ff0fef/config` |
| 9 | 20:25:27.531 | Response | http response | `200 {"job_id":"7ade0514-cf4d-431d-a8df-c5d894ff0fef","stage":"","prompt":"E2E test job","tools":["bash","read","write","edit","glob","grep"],"max_tokens":8096,"timeout_secs":600,"skill_content":"","model":"deepseek-chat","provider":"openai-compatible","base_url":"https://api.deepseek.com/v1","api...` |

---

## get skill content returns markdown

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.533 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.534 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327532-7qlsxc","description":"E2E test job"}` |
| 3 | 20:25:27.535 | Response | http response | `200 {"job_id":"43a67056-cd2a-4382-8dbd-649ae3b46f55"}` |
| 4 | 20:25:27.535 | Send | http.send | `POST /api/v1/workers {"job_id":"43a67056-cd2a-4382-8dbd-649ae3b46f55","provider":"test"}` |
| 5 | 20:25:27.537 | Response | http response | `200 {"worker_id":"c36752f6-11e2-46c4-b15e-b3720abd8104"}` |
| 6 | 20:25:27.537 | Send | http.send | `POST /api/v1/workers/c36752f6-11e2-46c4-b15e-b3720abd8104/register {"job_id":"43a67056-cd2a-4382-8dbd-649ae3b46f55"}` |
| 7 | 20:25:27.539 | Response | http response | `200 ` |
| 8 | 20:25:27.539 | Send | http.send | `GET /api/v1/jobs/43a67056-cd2a-4382-8dbd-649ae3b46f55/skill/plan` |
| 9 | 20:25:27.539 | Response | http response | `200 {"content":"You are a senior software engineer tasked with creating an implementation plan.\n\n## Instructions\n\n- Explore the project structure first using glob and grep\n- Identify all files and modules relevant to the task\n- Produce a clear, step-by-step implementation plan\n- Estimate t...` |

---

## unknown worker returns 404

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.540 | Send | http.send | `POST /api/v1/workers/nonexistent-id/register {"job_id":"fake-job"}` |
| 2 | 20:25:27.540 | Response | http response | `404 worker not found` |

---

## creates project via SQL seed and reads via HTTP and SQL

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.542 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.543 | Send | http.send | `GET /api/v1/projects` |
| 3 | 20:25:27.544 | Response | http response | `200 [{"id":"test-1778790327348-6kaux5","repo_url":"https://github.com/test/test-1778790327348-6kaux5","branch":"main","created_at":"2026-05-14T20:25:27.348Z","updated_at":"2026-05-14T20:25:27.348Z"},{"id":"test-1778790327354-a7okim","repo_url":"https://github.com/test/test-1778790327354-a7okim","...` |

---

## creates job via HTTP, verifies via HTTP and SQL

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.546 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.547 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327544-9t9056","description":"DB test job"}` |
| 3 | 20:25:27.547 | Recv | sql:jobs | `{"id":"9453feac-d5ff-436b-91c2-2e09c83ee199","project_id":"test-1778790327544-9t9056","description":"DB test job","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"2...` |
| 4 | 20:25:27.548 | Response | http response | `200 {"job_id":"9453feac-d5ff-436b-91c2-2e09c83ee199"}` |
| 5 | 20:25:27.548 | Send | http.send | `GET /api/v1/jobs/9453feac-d5ff-436b-91c2-2e09c83ee199` |
| 6 | 20:25:27.548 | Response | http response | `200 {"id":"9453feac-d5ff-436b-91c2-2e09c83ee199","project_id":"test-1778790327544-9t9056","description":"DB test job","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at...` |

---

## stores checkpoint and verifies via SQL

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.551 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.552 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327550-k03ekp","description":"Checkpoint test"}` |
| 3 | 20:25:27.552 | Recv | sql:jobs | `{"id":"d234ab5b-c794-4027-9196-63ef9221334f","project_id":"test-1778790327550-k03ekp","description":"Checkpoint test","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at...` |
| 4 | 20:25:27.553 | Response | http response | `200 {"job_id":"d234ab5b-c794-4027-9196-63ef9221334f"}` |
| 5 | 20:25:27.553 | Send | http.send | `POST /api/v1/workers {"job_id":"d234ab5b-c794-4027-9196-63ef9221334f","provider":"test"}` |
| 6 | 20:25:27.554 | Recv | sql:workers | `{"id":"7687d37b-2fae-4345-93db-13fa3db7b831","job_id":"d234ab5b-c794-4027-9196-63ef9221334f","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.554042845+00:00","destroyed_at":null}` |
| 7 | 20:25:27.556 | Response | http response | `200 {"worker_id":"7687d37b-2fae-4345-93db-13fa3db7b831"}` |
| 8 | 20:25:27.556 | Send | http.send | `POST /api/v1/workers/7687d37b-2fae-4345-93db-13fa3db7b831/register {"job_id":"d234ab5b-c794-4027-9196-63ef9221334f"}` |
| 9 | 20:25:27.556 | Recv | sql:workers | `{"id":"7687d37b-2fae-4345-93db-13fa3db7b831","job_id":"d234ab5b-c794-4027-9196-63ef9221334f","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.554042845+00:00","destroyed_at":null}` |
| 10 | 20:25:27.557 | Recv | sql:jobs | `{"id":"d234ab5b-c794-4027-9196-63ef9221334f","project_id":"test-1778790327550-k03ekp","description":"Checkpoint test","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_a...` |
| 11 | 20:25:27.559 | Response | http response | `200 ` |
| 12 | 20:25:27.559 | Send | http.send | `POST /api/v1/workers/7687d37b-2fae-4345-93db-13fa3db7b831/checkpoint {"stage":"plan","response":{"complexity":"simple"},"session_path":"/tmp/session.json","git_sha":"abc123","token_usage":{"prompt_...` |
| 13 | 20:25:27.560 | Recv | sql:checkpoints | `{"id":"95753388-bb92-42f6-8f23-49390d9482ad","job_id":"d234ab5b-c794-4027-9196-63ef9221334f","stage":"plan","response":"{\"complexity\":\"simple\"}","session_path":"/tmp/session.json","git_sha":"abc123","token_usage":"{\"prompt_tokens\":100,\"completion_tokens\":50}","files_changed":"[\"src/main....` |
| 14 | 20:25:27.562 | Recv | sql:jobs | `{"id":"d234ab5b-c794-4027-9196-63ef9221334f","project_id":"test-1778790327550-k03ekp","description":"Checkpoint test","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":"done","stage_history":"[{\"stage\":\"plan\",\"status\":\"completed\"}]","attempt":1,"max_at...` |
| 15 | 20:25:27.563 | Response | http response | `200 ` |

---

## tracks worker heartbeat in DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.566 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.567 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327565-7o3qs0","description":"Heartbeat test"}` |
| 3 | 20:25:27.567 | Recv | sql:jobs | `{"id":"a61853d2-f383-449e-aee5-065929b4378b","project_id":"test-1778790327565-7o3qs0","description":"Heartbeat test","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at"...` |
| 4 | 20:25:27.568 | Response | http response | `200 {"job_id":"a61853d2-f383-449e-aee5-065929b4378b"}` |
| 5 | 20:25:27.568 | Send | http.send | `POST /api/v1/workers {"job_id":"a61853d2-f383-449e-aee5-065929b4378b","provider":"test"}` |
| 6 | 20:25:27.568 | Recv | sql:workers | `{"id":"f06473a4-1f63-4ba8-9f79-5e1be1381690","job_id":"a61853d2-f383-449e-aee5-065929b4378b","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.568698529+00:00","destroyed_at":null}` |
| 7 | 20:25:27.569 | Response | http response | `200 {"worker_id":"f06473a4-1f63-4ba8-9f79-5e1be1381690"}` |
| 8 | 20:25:27.569 | Send | http.send | `POST /api/v1/workers/f06473a4-1f63-4ba8-9f79-5e1be1381690/register {"job_id":"a61853d2-f383-449e-aee5-065929b4378b"}` |
| 9 | 20:25:27.569 | Recv | sql:workers | `{"id":"f06473a4-1f63-4ba8-9f79-5e1be1381690","job_id":"a61853d2-f383-449e-aee5-065929b4378b","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.568698529+00:00","destroyed_at":null}` |
| 10 | 20:25:27.570 | Recv | sql:jobs | `{"id":"a61853d2-f383-449e-aee5-065929b4378b","project_id":"test-1778790327565-7o3qs0","description":"Heartbeat test","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at...` |
| 11 | 20:25:27.571 | Response | http response | `200 ` |
| 12 | 20:25:27.571 | Send | http.send | `POST /api/v1/workers/f06473a4-1f63-4ba8-9f79-5e1be1381690/heartbeat {"status":"running","current_stage":"plan","token_usage":{"prompt_tokens":100,"completion_tokens":50},"files_changed":0,"tool_cal...` |
| 13 | 20:25:27.571 | Recv | sql:workers | `{"id":"f06473a4-1f63-4ba8-9f79-5e1be1381690","job_id":"a61853d2-f383-449e-aee5-065929b4378b","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":"2026-05-14T20:25:27.571553419+00:00","created_at":"2026-05-14T20:25:27.568698529+00:00","des...` |
| 14 | 20:25:27.572 | Response | http response | `200 ` |

---

## destroyed workers removed from DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.575 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.575 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327573-kwhfmj","description":"Destroy test"}` |
| 3 | 20:25:27.576 | Recv | sql:jobs | `{"id":"8f52651c-ed72-4452-af48-755c25943b35","project_id":"test-1778790327573-kwhfmj","description":"Destroy test","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"...` |
| 4 | 20:25:27.577 | Response | http response | `200 {"job_id":"8f52651c-ed72-4452-af48-755c25943b35"}` |
| 5 | 20:25:27.577 | Send | http.send | `POST /api/v1/workers {"job_id":"8f52651c-ed72-4452-af48-755c25943b35","provider":"test"}` |
| 6 | 20:25:27.577 | Recv | sql:workers | `{"id":"88af7a2d-a693-484a-aec2-7b7141f83422","job_id":"8f52651c-ed72-4452-af48-755c25943b35","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.577744223+00:00","destroyed_at":null}` |
| 7 | 20:25:27.578 | Response | http response | `200 {"worker_id":"88af7a2d-a693-484a-aec2-7b7141f83422"}` |
| 8 | 20:25:27.578 | Send | http.send | `POST /api/v1/workers/88af7a2d-a693-484a-aec2-7b7141f83422/register {"job_id":"8f52651c-ed72-4452-af48-755c25943b35"}` |
| 9 | 20:25:27.578 | Recv | sql:workers | `{"id":"88af7a2d-a693-484a-aec2-7b7141f83422","job_id":"8f52651c-ed72-4452-af48-755c25943b35","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.577744223+00:00","destroyed_at":null}` |
| 10 | 20:25:27.579 | Recv | sql:jobs | `{"id":"8f52651c-ed72-4452-af48-755c25943b35","project_id":"test-1778790327573-kwhfmj","description":"Destroy test","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":...` |
| 11 | 20:25:27.580 | Response | http response | `200 ` |
| 12 | 20:25:27.580 | Send | http.send | `POST /api/v1/workers/88af7a2d-a693-484a-aec2-7b7141f83422/complete {"result":"done"}` |
| 13 | 20:25:27.581 | Recv | sql:jobs | `{"id":"8f52651c-ed72-4452-af48-755c25943b35","project_id":"test-1778790327573-kwhfmj","description":"Destroy test","status":"completed","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":"done","error":null,"created_...` |
| 14 | 20:25:27.582 | Recv | sql:workers | `{"id":"88af7a2d-a693-484a-aec2-7b7141f83422","job_id":"8f52651c-ed72-4452-af48-755c25943b35","provider":"test","provider_id":null,"status":"stopped","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.577744223+00:00","destroyed_at":"2026-05-14T20:25:27.5...` |
| 15 | 20:25:27.583 | Response | http response | `200 ` |

---

## creates a job with hello-world workflow

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.587 | Recv | sql:jobs | `{"id":"b4797e27-07cb-4778-bf3e-2d979b9a38e2","project_id":"test-1778790327585-b3o8c3","description":"Hello world test","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_a...` |

---

## job config returns resolved stage info

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.590 | Send | http.send | `GET /api/v1/jobs/b4797e27-07cb-4778-bf3e-2d979b9a38e2/config` |
| 2 | 20:25:27.590 | Response | http response | `200 {"job_id":"b4797e27-07cb-4778-bf3e-2d979b9a38e2","stage":"","prompt":"Hello world test","tools":["bash","read","write","edit","glob","grep"],"max_tokens":8096,"timeout_secs":600,"skill_content":"","model":"deepseek-chat","provider":"openai-compatible","base_url":"https://api.deepseek.com/v1",...` |

---

## create project → create job → register worker → complete

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.593 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.594 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327592-7ivgqb","description":"Full lifecycle test"}` |
| 3 | 20:25:27.594 | Recv | sql:jobs | `{"id":"b9ab2bfc-e6b1-4a8e-9b52-b8a983ebc9b4","project_id":"test-1778790327592-7ivgqb","description":"Full lifecycle test","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"create...` |
| 4 | 20:25:27.595 | Response | http response | `200 {"job_id":"b9ab2bfc-e6b1-4a8e-9b52-b8a983ebc9b4"}` |
| 5 | 20:25:27.597 | Send | http.send | `POST /api/v1/workers {"job_id":"b9ab2bfc-e6b1-4a8e-9b52-b8a983ebc9b4","provider":"test"}` |
| 6 | 20:25:27.597 | Recv | sql:workers | `{"id":"88006d49-c912-46ec-bcdf-1466278ea90e","job_id":"b9ab2bfc-e6b1-4a8e-9b52-b8a983ebc9b4","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.597698128+00:00","destroyed_at":null}` |
| 7 | 20:25:27.599 | Response | http response | `200 {"worker_id":"88006d49-c912-46ec-bcdf-1466278ea90e"}` |
| 8 | 20:25:27.599 | Send | http.send | `POST /api/v1/workers/88006d49-c912-46ec-bcdf-1466278ea90e/register {"job_id":"b9ab2bfc-e6b1-4a8e-9b52-b8a983ebc9b4"}` |
| 9 | 20:25:27.599 | Recv | sql:workers | `{"id":"88006d49-c912-46ec-bcdf-1466278ea90e","job_id":"b9ab2bfc-e6b1-4a8e-9b52-b8a983ebc9b4","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.597698128+00:00","destroyed_at":null}` |
| 10 | 20:25:27.600 | Recv | sql:jobs | `{"id":"b9ab2bfc-e6b1-4a8e-9b52-b8a983ebc9b4","project_id":"test-1778790327592-7ivgqb","description":"Full lifecycle test","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"creat...` |
| 11 | 20:25:27.601 | Response | http response | `200 ` |
| 12 | 20:25:27.602 | Send | http.send | `POST /api/v1/workers/88006d49-c912-46ec-bcdf-1466278ea90e/heartbeat {"status":"running","current_stage":"plan","token_usage":{"prompt_tokens":100,"completion_tokens":50},"files_changed":0,"tool_cal...` |
| 13 | 20:25:27.602 | Recv | sql:workers | `{"id":"88006d49-c912-46ec-bcdf-1466278ea90e","job_id":"b9ab2bfc-e6b1-4a8e-9b52-b8a983ebc9b4","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":"2026-05-14T20:25:27.602799210+00:00","created_at":"2026-05-14T20:25:27.597698128+00:00","des...` |
| 14 | 20:25:27.604 | Response | http response | `200 ` |
| 15 | 20:25:27.606 | Send | http.send | `POST /api/v1/workers/88006d49-c912-46ec-bcdf-1466278ea90e/checkpoint {"stage":"plan","response":{"complexity":"simple"},"session_path":"/workspace/.codery/session.json","git_sha":"abc123","token_us...` |
| 16 | 20:25:27.606 | Recv | sql:checkpoints | `{"id":"b5620c84-acb8-4b7c-a2a8-52a96913e131","job_id":"b9ab2bfc-e6b1-4a8e-9b52-b8a983ebc9b4","stage":"plan","response":"{\"complexity\":\"simple\"}","session_path":"/workspace/.codery/session.json","git_sha":"abc123","token_usage":"{\"prompt_tokens\":100,\"completion_tokens\":50}","files_changed"...` |
| 17 | 20:25:27.608 | Recv | sql:jobs | `{"id":"b9ab2bfc-e6b1-4a8e-9b52-b8a983ebc9b4","project_id":"test-1778790327592-7ivgqb","description":"Full lifecycle test","status":"running","worker_id":null,"branch":null,"workflow_name":null,"current_stage":"done","stage_history":"[{\"stage\":\"plan\",\"status\":\"completed\"}]","attempt":1,"ma...` |
| 18 | 20:25:27.611 | Response | http response | `200 ` |
| 19 | 20:25:27.613 | Send | http.send | `POST /api/v1/workers/88006d49-c912-46ec-bcdf-1466278ea90e/complete {"result":"Job completed successfully"}` |
| 20 | 20:25:27.613 | Recv | sql:jobs | `{"id":"b9ab2bfc-e6b1-4a8e-9b52-b8a983ebc9b4","project_id":"test-1778790327592-7ivgqb","description":"Full lifecycle test","status":"completed","worker_id":null,"branch":null,"workflow_name":null,"current_stage":"done","stage_history":"[{\"stage\":\"plan\",\"status\":\"completed\"}]","attempt":1,"...` |
| 21 | 20:25:27.614 | Recv | sql:workers | `{"id":"88006d49-c912-46ec-bcdf-1466278ea90e","job_id":"b9ab2bfc-e6b1-4a8e-9b52-b8a983ebc9b4","provider":"test","provider_id":null,"status":"stopped","ip_address":null,"workspace_path":null,"heartbeat_at":"2026-05-14T20:25:27.602799210+00:00","created_at":"2026-05-14T20:25:27.597698128+00:00","des...` |
| 22 | 20:25:27.615 | Response | http response | `200 ` |

---

## lists jobs and workers via HTTP matches DB

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.617 | Send | http.send | `GET /api/v1/jobs` |
| 2 | 20:25:27.617 | Response | http response | `200 [{"id":"00a06c0a-e250-4288-a60f-354918b5ffc6","project_id":"test-1778790327348-6kaux5","description":"Dashboard test job","status":"queued","worker_id":null,"branch":null,"workflow_name":null,"current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"cr...` |
| 3 | 20:25:27.618 | Send | http.send | `GET /api/v1/workers` |
| 4 | 20:25:27.618 | Response | http response | `200 [{"id":"5a06397b-4b5a-4360-8205-5fe235e800e0","job_id":"bbf43ff7-334d-49b8-a252-ed3a715c3dce","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.362703807+00:00","destroyed_at":null},{"id":"5c77...` |

---

## validates workflow YAML

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.618 | Send | http.send | `POST /api/v1/workflows/validate {"content":"\nname: test\nstages:\n plan:\n skill: plan\n prompt: \"Plan: {{input}}\"\n tools: [bash]\n routes: null\n"}` |
| 2 | 20:25:27.618 | Response | http response | `200 {"name":"test","stages":1,"valid":true}` |

---

## rejects invalid workflow YAML

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.619 | Send | http.send | `POST /api/v1/workflows/validate {"content":"name: bad\nstages: {}\n"}` |
| 2 | 20:25:27.619 | Response | http response | `200 {"error":"workflow needs at least one stage","valid":false}` |

---

## routes based on string equality in response

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.914 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.915 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327912-5ym6jf","description":"Build feature","workflow":"feature"}` |
| 3 | 20:25:27.915 | Recv | sql:jobs | `{"id":"686f9df4-8d3f-41ee-b2db-349a23763e68","project_id":"test-1778790327912-5ym6jf","description":"Build feature","status":"queued","worker_id":null,"branch":null,"workflow_name":"feature","current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created...` |
| 4 | 20:25:27.917 | Response | http response | `200 {"job_id":"686f9df4-8d3f-41ee-b2db-349a23763e68"}` |
| 5 | 20:25:27.917 | Send | http.send | `POST /api/v1/workers {"job_id":"686f9df4-8d3f-41ee-b2db-349a23763e68","provider":"test"}` |
| 6 | 20:25:27.917 | Recv | sql:workers | `{"id":"d5e9bdf2-11c4-4501-b279-c74c96c09eae","job_id":"686f9df4-8d3f-41ee-b2db-349a23763e68","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.917533523+00:00","destroyed_at":null}` |
| 7 | 20:25:27.919 | Response | http response | `200 {"worker_id":"d5e9bdf2-11c4-4501-b279-c74c96c09eae"}` |
| 8 | 20:25:27.919 | Send | http.send | `POST /api/v1/workers/d5e9bdf2-11c4-4501-b279-c74c96c09eae/register {"job_id":"686f9df4-8d3f-41ee-b2db-349a23763e68"}` |
| 9 | 20:25:27.919 | Recv | sql:workers | `{"id":"d5e9bdf2-11c4-4501-b279-c74c96c09eae","job_id":"686f9df4-8d3f-41ee-b2db-349a23763e68","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.917533523+00:00","destroyed_at":null}` |
| 10 | 20:25:27.921 | Recv | sql:jobs | `{"id":"686f9df4-8d3f-41ee-b2db-349a23763e68","project_id":"test-1778790327912-5ym6jf","description":"Build feature","status":"running","worker_id":null,"branch":null,"workflow_name":"feature","current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"create...` |
| 11 | 20:25:27.922 | Response | http response | `200 ` |
| 12 | 20:25:27.922 | Send | http.send | `POST /api/v1/workers/d5e9bdf2-11c4-4501-b279-c74c96c09eae/checkpoint {"stage":"plan","response":{"complexity":"simple"},"session_path":"/tmp/session.json","git_sha":"abc123","token_usage":{"prompt_...` |
| 13 | 20:25:27.923 | Recv | sql:checkpoints | `{"id":"c1941508-27e6-4cff-804b-641c7f7dbd4f","job_id":"686f9df4-8d3f-41ee-b2db-349a23763e68","stage":"plan","response":"{\"complexity\":\"simple\"}","session_path":"/tmp/session.json","git_sha":"abc123","token_usage":"{\"prompt_tokens\":100,\"completion_tokens\":50}","files_changed":"[]","created...` |
| 14 | 20:25:27.925 | Recv | sql:jobs | `{"id":"686f9df4-8d3f-41ee-b2db-349a23763e68","project_id":"test-1778790327912-5ym6jf","description":"Build feature","status":"running","worker_id":null,"branch":null,"workflow_name":"feature","current_stage":"implement","stage_history":"[{\"stage\":\"plan\",\"status\":\"completed\"}]","attempt":1...` |
| 15 | 20:25:27.927 | Response | http response | `200 ` |

---

## routes to plan_detail on complex response

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.932 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.934 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327930-gan9ac","description":"Complex feature","workflow":"feature"}` |
| 3 | 20:25:27.934 | Recv | sql:jobs | `{"id":"438a054d-df82-4029-9249-cb2bda78b999","project_id":"test-1778790327930-gan9ac","description":"Complex feature","status":"queued","worker_id":null,"branch":null,"workflow_name":"feature","current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"creat...` |
| 4 | 20:25:27.936 | Response | http response | `200 {"job_id":"438a054d-df82-4029-9249-cb2bda78b999"}` |
| 5 | 20:25:27.936 | Send | http.send | `POST /api/v1/workers {"job_id":"438a054d-df82-4029-9249-cb2bda78b999","provider":"test"}` |
| 6 | 20:25:27.936 | Recv | sql:workers | `{"id":"7677eec9-f848-4f4e-adb5-52c4017d0bca","job_id":"438a054d-df82-4029-9249-cb2bda78b999","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.936755744+00:00","destroyed_at":null}` |
| 7 | 20:25:27.938 | Response | http response | `200 {"worker_id":"7677eec9-f848-4f4e-adb5-52c4017d0bca"}` |
| 8 | 20:25:27.938 | Send | http.send | `POST /api/v1/workers/7677eec9-f848-4f4e-adb5-52c4017d0bca/register {"job_id":"438a054d-df82-4029-9249-cb2bda78b999"}` |
| 9 | 20:25:27.938 | Recv | sql:workers | `{"id":"7677eec9-f848-4f4e-adb5-52c4017d0bca","job_id":"438a054d-df82-4029-9249-cb2bda78b999","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.936755744+00:00","destroyed_at":null}` |
| 10 | 20:25:27.940 | Recv | sql:jobs | `{"id":"438a054d-df82-4029-9249-cb2bda78b999","project_id":"test-1778790327930-gan9ac","description":"Complex feature","status":"running","worker_id":null,"branch":null,"workflow_name":"feature","current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"crea...` |
| 11 | 20:25:27.941 | Response | http response | `200 ` |
| 12 | 20:25:27.941 | Send | http.send | `POST /api/v1/workers/7677eec9-f848-4f4e-adb5-52c4017d0bca/checkpoint {"stage":"plan","response":{"complexity":"complex"},"session_path":"/tmp/session.json","git_sha":"abc123","token_usage":{"prompt...` |
| 13 | 20:25:27.942 | Recv | sql:checkpoints | `{"id":"06c593f9-cf26-4703-b6e6-0836051f9d31","job_id":"438a054d-df82-4029-9249-cb2bda78b999","stage":"plan","response":"{\"complexity\":\"complex\"}","session_path":"/tmp/session.json","git_sha":"abc123","token_usage":"{\"prompt_tokens\":100,\"completion_tokens\":50}","files_changed":"[]","create...` |
| 14 | 20:25:27.943 | Recv | sql:jobs | `{"id":"438a054d-df82-4029-9249-cb2bda78b999","project_id":"test-1778790327930-gan9ac","description":"Complex feature","status":"running","worker_id":null,"branch":null,"workflow_name":"feature","current_stage":"plan_detail","stage_history":"[{\"stage\":\"plan\",\"status\":\"completed\"}]","attemp...` |
| 15 | 20:25:27.944 | Response | http response | `200 ` |

---

## completes workflow when routes is null

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.948 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.950 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327946-xfrhsz","description":"Simple task","workflow":"simple"}` |
| 3 | 20:25:27.950 | Recv | sql:jobs | `{"id":"c87137af-d709-4088-b9f7-88162b08df43","project_id":"test-1778790327946-xfrhsz","description":"Simple task","status":"queued","worker_id":null,"branch":null,"workflow_name":"simple","current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at...` |
| 4 | 20:25:27.951 | Response | http response | `200 {"job_id":"c87137af-d709-4088-b9f7-88162b08df43"}` |
| 5 | 20:25:27.951 | Send | http.send | `POST /api/v1/workers {"job_id":"c87137af-d709-4088-b9f7-88162b08df43","provider":"test"}` |
| 6 | 20:25:27.951 | Recv | sql:workers | `{"id":"ef0f96c4-fd31-489b-bead-9033cba5818d","job_id":"c87137af-d709-4088-b9f7-88162b08df43","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.951772522+00:00","destroyed_at":null}` |
| 7 | 20:25:27.953 | Response | http response | `200 {"worker_id":"ef0f96c4-fd31-489b-bead-9033cba5818d"}` |
| 8 | 20:25:27.953 | Send | http.send | `POST /api/v1/workers/ef0f96c4-fd31-489b-bead-9033cba5818d/register {"job_id":"c87137af-d709-4088-b9f7-88162b08df43"}` |
| 9 | 20:25:27.953 | Recv | sql:workers | `{"id":"ef0f96c4-fd31-489b-bead-9033cba5818d","job_id":"c87137af-d709-4088-b9f7-88162b08df43","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.951772522+00:00","destroyed_at":null}` |
| 10 | 20:25:27.954 | Recv | sql:jobs | `{"id":"c87137af-d709-4088-b9f7-88162b08df43","project_id":"test-1778790327946-xfrhsz","description":"Simple task","status":"running","worker_id":null,"branch":null,"workflow_name":"simple","current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_a...` |
| 11 | 20:25:27.955 | Response | http response | `200 ` |
| 12 | 20:25:27.955 | Send | http.send | `POST /api/v1/workers/ef0f96c4-fd31-489b-bead-9033cba5818d/complete {"result":"done"}` |
| 13 | 20:25:27.955 | Recv | sql:jobs | `{"id":"c87137af-d709-4088-b9f7-88162b08df43","project_id":"test-1778790327946-xfrhsz","description":"Simple task","status":"completed","worker_id":null,"branch":null,"workflow_name":"simple","current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":"done","error":null,"creat...` |
| 14 | 20:25:27.956 | Recv | sql:workers | `{"id":"ef0f96c4-fd31-489b-bead-9033cba5818d","job_id":"c87137af-d709-4088-b9f7-88162b08df43","provider":"test","provider_id":null,"status":"stopped","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.951772522+00:00","destroyed_at":"2026-05-14T20:25:27.9...` |
| 15 | 20:25:27.957 | Response | http response | `200 ` |

---

## validates numeric routing workflow

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.958 | Send | http.send | `POST /api/v1/workflows/validate {"content":"\nname: numeric-route\ndescription: \"Numeric routing\"\nstages:\n check:\n skill: plan\n prompt: \"Check\"\n tools: [bash]\n max_tokens: 8000\n routes:\...` |
| 2 | 20:25:27.959 | Response | http response | `200 {"name":"numeric-route","stages":3,"valid":true}` |

---

## parses valid workflow YAML

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.961 | Send | http.send | `POST /api/v1/workflows/validate {"content":"\nname: simple\ndescription: \"Simple workflow\"\nstages:\n plan:\n skill: plan\n prompt: \"Plan: {{input}}\"\n tools: [bash, read]\n max_tokens: 8000\n ...` |
| 2 | 20:25:27.961 | Response | http response | `200 {"name":"simple","stages":2,"valid":true}` |

---

## rejects empty stages

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.962 | Send | http.send | `POST /api/v1/workflows/validate {"content":"\nname: empty\ndescription: \"No stages\"\nstages: {}\n"}` |
| 2 | 20:25:27.962 | Response | http response | `200 {"error":"workflow needs at least one stage","valid":false}` |

---

## accepts single-stage workflow

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.962 | Send | http.send | `POST /api/v1/workflows/validate {"content":"\nname: minimal\ndescription: \"One stage\"\nstages:\n work:\n prompt: \"Do it\"\n tools: [bash]\n max_tokens: 4000\n routes: null\n"}` |
| 2 | 20:25:27.962 | Response | http response | `200 {"name":"minimal","stages":1,"valid":true}` |

---

## checkpoint advances to next stage

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.972 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.973 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327970-9ns2j9","description":"Advance stages","workflow":"feature"}` |
| 3 | 20:25:27.973 | Recv | sql:jobs | `{"id":"b12186d1-c5f7-4647-823f-46f07f436ce4","project_id":"test-1778790327970-9ns2j9","description":"Advance stages","status":"queued","worker_id":null,"branch":null,"workflow_name":"feature","current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"create...` |
| 4 | 20:25:27.974 | Response | http response | `200 {"job_id":"b12186d1-c5f7-4647-823f-46f07f436ce4"}` |
| 5 | 20:25:27.974 | Send | http.send | `POST /api/v1/workers {"job_id":"b12186d1-c5f7-4647-823f-46f07f436ce4","provider":"test"}` |
| 6 | 20:25:27.975 | Recv | sql:workers | `{"id":"7be06623-5d01-4f3b-9367-c84087eaed8c","job_id":"b12186d1-c5f7-4647-823f-46f07f436ce4","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.975113337+00:00","destroyed_at":null}` |
| 7 | 20:25:27.976 | Response | http response | `200 {"worker_id":"7be06623-5d01-4f3b-9367-c84087eaed8c"}` |
| 8 | 20:25:27.976 | Send | http.send | `POST /api/v1/workers/7be06623-5d01-4f3b-9367-c84087eaed8c/register {"job_id":"b12186d1-c5f7-4647-823f-46f07f436ce4"}` |
| 9 | 20:25:27.976 | Recv | sql:workers | `{"id":"7be06623-5d01-4f3b-9367-c84087eaed8c","job_id":"b12186d1-c5f7-4647-823f-46f07f436ce4","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.975113337+00:00","destroyed_at":null}` |
| 10 | 20:25:27.978 | Recv | sql:jobs | `{"id":"b12186d1-c5f7-4647-823f-46f07f436ce4","project_id":"test-1778790327970-9ns2j9","description":"Advance stages","status":"running","worker_id":null,"branch":null,"workflow_name":"feature","current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"creat...` |
| 11 | 20:25:27.979 | Response | http response | `200 ` |
| 12 | 20:25:27.979 | Send | http.send | `POST /api/v1/workers/7be06623-5d01-4f3b-9367-c84087eaed8c/checkpoint {"stage":"plan","response":{"complexity":"simple"},"session_path":"/tmp/session.json","git_sha":"abc123","token_usage":{"prompt_...` |
| 13 | 20:25:27.979 | Recv | sql:checkpoints | `{"id":"73a64ac1-acf2-4148-a930-afe6c57c9602","job_id":"b12186d1-c5f7-4647-823f-46f07f436ce4","stage":"plan","response":"{\"complexity\":\"simple\"}","session_path":"/tmp/session.json","git_sha":"abc123","token_usage":"{\"prompt_tokens\":100,\"completion_tokens\":50}","files_changed":"[]","created...` |
| 14 | 20:25:27.981 | Recv | sql:jobs | `{"id":"b12186d1-c5f7-4647-823f-46f07f436ce4","project_id":"test-1778790327970-9ns2j9","description":"Advance stages","status":"running","worker_id":null,"branch":null,"workflow_name":"feature","current_stage":"implement","stage_history":"[{\"stage\":\"plan\",\"status\":\"completed\"}]","attempt":...` |
| 15 | 20:25:27.982 | Response | http response | `200 ` |

---

## multi-stage progression through feature workflow

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:27.986 | Send | sql.put | `1 rows` |
| 2 | 20:25:27.987 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327984-kppsf7","description":"Multi-stage","workflow":"feature"}` |
| 3 | 20:25:27.987 | Recv | sql:jobs | `{"id":"3a53dfc0-10dc-45a4-ab3e-2b564e37a841","project_id":"test-1778790327984-kppsf7","description":"Multi-stage","status":"queued","worker_id":null,"branch":null,"workflow_name":"feature","current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_a...` |
| 4 | 20:25:27.988 | Response | http response | `200 {"job_id":"3a53dfc0-10dc-45a4-ab3e-2b564e37a841"}` |
| 5 | 20:25:27.989 | Send | http.send | `POST /api/v1/workers {"job_id":"3a53dfc0-10dc-45a4-ab3e-2b564e37a841","provider":"test"}` |
| 6 | 20:25:27.989 | Recv | sql:workers | `{"id":"5a43d6b0-7b6f-42aa-ae28-aced30a2450e","job_id":"3a53dfc0-10dc-45a4-ab3e-2b564e37a841","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.989218291+00:00","destroyed_at":null}` |
| 7 | 20:25:27.990 | Response | http response | `200 {"worker_id":"5a43d6b0-7b6f-42aa-ae28-aced30a2450e"}` |
| 8 | 20:25:27.990 | Send | http.send | `POST /api/v1/workers/5a43d6b0-7b6f-42aa-ae28-aced30a2450e/register {"job_id":"3a53dfc0-10dc-45a4-ab3e-2b564e37a841"}` |
| 9 | 20:25:27.990 | Recv | sql:workers | `{"id":"5a43d6b0-7b6f-42aa-ae28-aced30a2450e","job_id":"3a53dfc0-10dc-45a4-ab3e-2b564e37a841","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:27.989218291+00:00","destroyed_at":null}` |
| 10 | 20:25:27.991 | Recv | sql:jobs | `{"id":"3a53dfc0-10dc-45a4-ab3e-2b564e37a841","project_id":"test-1778790327984-kppsf7","description":"Multi-stage","status":"running","worker_id":null,"branch":null,"workflow_name":"feature","current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_...` |
| 11 | 20:25:27.993 | Response | http response | `200 ` |
| 12 | 20:25:27.993 | Send | http.send | `POST /api/v1/workers/5a43d6b0-7b6f-42aa-ae28-aced30a2450e/checkpoint {"stage":"plan","response":{"complexity":"simple"},"session_path":"/tmp/s1.json","git_sha":"aaa111","token_usage":{"prompt_token...` |
| 13 | 20:25:27.993 | Recv | sql:checkpoints | `{"id":"7df3bcbe-8d78-4513-90d6-5003b15279ea","job_id":"3a53dfc0-10dc-45a4-ab3e-2b564e37a841","stage":"plan","response":"{\"complexity\":\"simple\"}","session_path":"/tmp/s1.json","git_sha":"aaa111","token_usage":"{\"prompt_tokens\":100,\"completion_tokens\":50}","files_changed":"[]","created_at":...` |
| 14 | 20:25:27.994 | Recv | sql:jobs | `{"id":"3a53dfc0-10dc-45a4-ab3e-2b564e37a841","project_id":"test-1778790327984-kppsf7","description":"Multi-stage","status":"running","worker_id":null,"branch":null,"workflow_name":"feature","current_stage":"implement","stage_history":"[{\"stage\":\"plan\",\"status\":\"completed\"}]","attempt":1,"...` |
| 15 | 20:25:27.995 | Response | http response | `200 ` |
| 16 | 20:25:27.995 | Send | http.send | `POST /api/v1/workers/5a43d6b0-7b6f-42aa-ae28-aced30a2450e/checkpoint {"stage":"implement","response":{"success":true},"session_path":"/tmp/s2.json","git_sha":"bbb222","token_usage":{"prompt_tokens"...` |
| 17 | 20:25:27.995 | Recv | sql:checkpoints | `{"id":"cce052b7-d626-4c08-81cd-fdf61d678f16","job_id":"3a53dfc0-10dc-45a4-ab3e-2b564e37a841","stage":"implement","response":"{\"success\":true}","session_path":"/tmp/s2.json","git_sha":"bbb222","token_usage":"{\"prompt_tokens\":200,\"completion_tokens\":100}","files_changed":"[\"src/main.rs\"]","...` |
| 18 | 20:25:27.997 | Recv | sql:jobs | `{"id":"3a53dfc0-10dc-45a4-ab3e-2b564e37a841","project_id":"test-1778790327984-kppsf7","description":"Multi-stage","status":"running","worker_id":null,"branch":null,"workflow_name":"feature","current_stage":"done","stage_history":"[{\"stage\":\"plan\",\"status\":\"completed\"},{\"stage\":\"impleme...` |
| 19 | 20:25:27.998 | Response | http response | `200 ` |

---

## complete finishes the job

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:28.000 | Send | sql.put | `1 rows` |
| 2 | 20:25:28.001 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790327999-fki5pv","description":"Complete workflow","workflow":"simple"}` |
| 3 | 20:25:28.002 | Recv | sql:jobs | `{"id":"5ba5dc18-d82e-46a2-9eee-7fccc12a8b1b","project_id":"test-1778790327999-fki5pv","description":"Complete workflow","status":"queued","worker_id":null,"branch":null,"workflow_name":"simple","current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"crea...` |
| 4 | 20:25:28.004 | Response | http response | `200 {"job_id":"5ba5dc18-d82e-46a2-9eee-7fccc12a8b1b"}` |
| 5 | 20:25:28.004 | Send | http.send | `POST /api/v1/workers {"job_id":"5ba5dc18-d82e-46a2-9eee-7fccc12a8b1b","provider":"test"}` |
| 6 | 20:25:28.004 | Recv | sql:workers | `{"id":"1d987b31-68d5-448a-bf74-fe3c008b3b70","job_id":"5ba5dc18-d82e-46a2-9eee-7fccc12a8b1b","provider":"test","provider_id":null,"status":"creating","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:28.004493379+00:00","destroyed_at":null}` |
| 7 | 20:25:28.007 | Response | http response | `200 {"worker_id":"1d987b31-68d5-448a-bf74-fe3c008b3b70"}` |
| 8 | 20:25:28.007 | Send | http.send | `POST /api/v1/workers/1d987b31-68d5-448a-bf74-fe3c008b3b70/register {"job_id":"5ba5dc18-d82e-46a2-9eee-7fccc12a8b1b"}` |
| 9 | 20:25:28.007 | Recv | sql:workers | `{"id":"1d987b31-68d5-448a-bf74-fe3c008b3b70","job_id":"5ba5dc18-d82e-46a2-9eee-7fccc12a8b1b","provider":"test","provider_id":null,"status":"running","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:28.004493379+00:00","destroyed_at":null}` |
| 10 | 20:25:28.008 | Recv | sql:jobs | `{"id":"5ba5dc18-d82e-46a2-9eee-7fccc12a8b1b","project_id":"test-1778790327999-fki5pv","description":"Complete workflow","status":"running","worker_id":null,"branch":null,"workflow_name":"simple","current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"cre...` |
| 11 | 20:25:28.009 | Response | http response | `200 ` |
| 12 | 20:25:28.009 | Send | http.send | `POST /api/v1/workers/1d987b31-68d5-448a-bf74-fe3c008b3b70/complete {"result":"all done"}` |
| 13 | 20:25:28.010 | Recv | sql:jobs | `{"id":"5ba5dc18-d82e-46a2-9eee-7fccc12a8b1b","project_id":"test-1778790327999-fki5pv","description":"Complete workflow","status":"completed","worker_id":null,"branch":null,"workflow_name":"simple","current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":"all done","error":n...` |
| 14 | 20:25:28.011 | Recv | sql:workers | `{"id":"1d987b31-68d5-448a-bf74-fe3c008b3b70","job_id":"5ba5dc18-d82e-46a2-9eee-7fccc12a8b1b","provider":"test","provider_id":null,"status":"stopped","ip_address":null,"workspace_path":null,"heartbeat_at":null,"created_at":"2026-05-14T20:25:28.004493379+00:00","destroyed_at":"2026-05-14T20:25:28.0...` |
| 15 | 20:25:28.012 | Response | http response | `200 ` |

---

## job config resolves {{input}} in prompt

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:28.016 | Send | sql.put | `1 rows` |
| 2 | 20:25:28.017 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790328015-a9qbcn","description":"Add a hello world function","workflow":"simple"}` |
| 3 | 20:25:28.017 | Recv | sql:jobs | `{"id":"8df2fac3-2406-4cb2-8cfb-2bb285fd824c","project_id":"test-1778790328015-a9qbcn","description":"Add a hello world function","status":"queued","worker_id":null,"branch":null,"workflow_name":"simple","current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":n...` |
| 4 | 20:25:28.021 | Response | http response | `200 {"job_id":"8df2fac3-2406-4cb2-8cfb-2bb285fd824c"}` |
| 5 | 20:25:28.021 | Send | http.send | `GET /api/v1/jobs/8df2fac3-2406-4cb2-8cfb-2bb285fd824c/config` |
| 6 | 20:25:28.021 | Response | http response | `200 {"job_id":"8df2fac3-2406-4cb2-8cfb-2bb285fd824c","stage":"","prompt":"Add a hello world function","tools":["bash","read","write","edit","glob","grep"],"max_tokens":8096,"timeout_secs":600,"skill_content":"","model":"deepseek-chat","provider":"openai-compatible","base_url":"https://api.deepsee...` |

---

## job config returns stage and tools

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:28.024 | Send | sql.put | `1 rows` |
| 2 | 20:25:28.025 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790328023-wnyh0x","description":"Build feature X","workflow":"feature"}` |
| 3 | 20:25:28.027 | Response | http response | `200 {"job_id":"f7b4cec4-4807-47a4-954e-ad16fcb5b447"}` |
| 4 | 20:25:28.027 | Send | http.send | `GET /api/v1/jobs/f7b4cec4-4807-47a4-954e-ad16fcb5b447/config` |
| 5 | 20:25:28.027 | Response | http response | `200 {"job_id":"f7b4cec4-4807-47a4-954e-ad16fcb5b447","stage":"","prompt":"Build feature X","tools":["bash","read","write","edit","glob","grep"],"max_tokens":8096,"timeout_secs":600,"skill_content":"","model":"deepseek-chat","provider":"openai-compatible","base_url":"https://api.deepseek.com/v1","...` |

---

## job config returns skill content for plan skill

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:28.028 | Send | sql.put | `1 rows` |
| 2 | 20:25:28.029 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790328027-5t4lao","description":"Plan the feature","workflow":"simple"}` |
| 3 | 20:25:28.030 | Response | http response | `200 {"job_id":"6d630625-d1cb-42bf-80a9-b73b9be3fb77"}` |
| 4 | 20:25:28.030 | Send | http.send | `GET /api/v1/jobs/6d630625-d1cb-42bf-80a9-b73b9be3fb77/config` |
| 5 | 20:25:28.031 | Response | http response | `200 {"job_id":"6d630625-d1cb-42bf-80a9-b73b9be3fb77","stage":"","prompt":"Plan the feature","tools":["bash","read","write","edit","glob","grep"],"max_tokens":8096,"timeout_secs":600,"skill_content":"","model":"deepseek-chat","provider":"openai-compatible","base_url":"https://api.deepseek.com/v1",...` |

---

## workflow seeded in DB is accessible via config

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 20:25:28.029 | Recv | sql:jobs | `{"id":"6d630625-d1cb-42bf-80a9-b73b9be3fb77","project_id":"test-1778790328027-5t4lao","description":"Plan the feature","status":"queued","worker_id":null,"branch":null,"workflow_name":"simple","current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"creat...` |
| 2 | 20:25:28.033 | Send | sql.put | `1 rows` |
| 3 | 20:25:28.034 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778790328032-poyj33","description":"Test","workflow":"simple"}` |
| 4 | 20:25:28.035 | Recv | sql:jobs | `{"id":"6b0f44c7-690d-41d4-8a78-6af163ed9fb9","project_id":"test-1778790328032-poyj33","description":"Test","status":"queued","worker_id":null,"branch":null,"workflow_name":"simple","current_stage":null,"stage_history":"[]","attempt":1,"max_attempts":3,"result":null,"error":null,"created_at":"2026...` |
| 5 | 20:25:28.036 | Response | http response | `200 {"job_id":"6b0f44c7-690d-41d4-8a78-6af163ed9fb9"}` |

---

