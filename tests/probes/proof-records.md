# Trailhead E2E Test Suite

**Date:** 2026-05-14T03:00:26.935Z
**Events:** 35
**Duration:** 20ms

---

### Sequence

| # | Time | Direction | Step | Detail |
|---|------|-----------|------|--------|
| 1 | 03:00:26.921 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778727626920-syj8ye","description":"Build feature","workflow":"feature"}` |
| 2 | 03:00:26.922 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |
| 3 | 03:00:26.922 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778727626922-i9bnp0","description":"Build feature","workflow":"feature"}` |
| 4 | 03:00:26.922 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |
| 5 | 03:00:26.922 | Send | http.send | `POST /api/v1/workflows/validate {"yaml":"\nname: numeric-route\ndescription: \"Numeric routing\"\nstages:\n check:\n skill: plan\n prompt: \"Check\"\n tools: [bash]\n max_tokens: 8000\n routes:\n -...` |
| 6 | 03:00:26.923 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |
| 7 | 03:00:26.923 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778727626923-ysa13v","description":"Build feature","workflow":"feature"}` |
| 8 | 03:00:26.923 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |
| 9 | 03:00:26.923 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778727626923-1ofb6w","description":"Simple task","workflow":"simple"}` |
| 10 | 03:00:26.923 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |
| 11 | 03:00:26.924 | Send | http.send | `POST /api/v1/workflows/validate {"yaml":"\nname: simple\ndescription: \"Simple workflow\"\nstages:\n plan:\n skill: plan\n prompt: \"Plan: {{input}}\"\n tools: [bash, read]\n max_tokens: 8000\n rou...` |
| 12 | 03:00:26.924 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |
| 13 | 03:00:26.924 | Send | http.send | `POST /api/v1/workflows/validate {"yaml":"\nname: empty\ndescription: \"No stages\"\nstages: {}\n"}` |
| 14 | 03:00:26.924 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |
| 15 | 03:00:26.925 | Send | http.send | `POST /api/v1/workflows/validate {"yaml":"\nname: bad-route\ndescription: \"Routes to nonexistent stage\"\nstages:\n plan:\n skill: plan\n prompt: \"Plan\"\n tools: [bash]\n max_tokens: 8000\n route...` |
| 16 | 03:00:26.925 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |
| 17 | 03:00:26.925 | Send | http.send | `POST /api/v1/workflows/validate {"yaml":"\nname: no-skill\ndescription: \"Stage without skill\"\nstages:\n plan:\n prompt: \"Plan\"\n tools: [bash]\n max_tokens: 8000\n routes:\n - when: 'true'\n n...` |
| 18 | 03:00:26.925 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |
| 19 | 03:00:26.926 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778727626926-x8o0te","description":"Start at first stage","workflow":"simple"}` |
| 20 | 03:00:26.926 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |
| 21 | 03:00:26.927 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778727626927-pog8r6","description":"Advance through stages","workflow":"feature"}` |
| 22 | 03:00:26.927 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |
| 23 | 03:00:26.927 | Send | http.send | `POST /api/v1/workflows/validate {"yaml":"\nname: pause-workflow\ndescription: \"Pauses mid-workflow\"\nstages:\n work:\n skill: plan\n prompt: \"Do work\"\n tools: [bash]\n max_tokens: 8000\n route...` |
| 24 | 03:00:26.927 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |
| 25 | 03:00:26.927 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778727626927-nkmzlj","description":"Complete workflow","workflow":"simple"}` |
| 26 | 03:00:26.927 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |
| 27 | 03:00:26.928 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778727626928-9s7lu4","description":"History tracking","workflow":"feature"}` |
| 28 | 03:00:26.928 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |
| 29 | 03:00:26.929 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778727626929-0ra78u","description":"Add a hello world function","workflow":"simple"}` |
| 30 | 03:00:26.929 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |
| 31 | 03:00:26.929 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778727626929-sot723","description":"Build feature X","workflow":"feature"}` |
| 32 | 03:00:26.929 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |
| 33 | 03:00:26.934 | Send | sql.put | `1 rows` |
| 34 | 03:00:26.934 | Send | http.send | `POST /api/v1/jobs {"project_id":"test-1778727626929-2zelq6","description":"Fix the bug","workflow":"simple"}` |
| 35 | 03:00:26.934 | Response | http response | `error: Unable to connect. Is the computer able to access the url?` |

---

