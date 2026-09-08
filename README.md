<img width="838" height="967" alt="Screenshot 2026-09-08 104542" src="https://github.com/user-attachments/assets/643466f0-281f-4a2d-a989-e13f9e98896f" /># Online Service Request Management System

## Problem Statement

The university's ICT office currently receives technical concerns through different channels such as verbal requests, text messages, and social media.
Because requests come from different channels, some concerns may be forgotten, duplicated, or not properly monitored.

The Online Service Request Management System provides a simple web-based system where authorized users can record and manage technical support requests. 
It helps organize requests and makes it easier to monitor their current status.

## Actors
Primary Actor: System User / ICT Personnel

## Use Case Diagram
<img width="300" height="300" alt="Use-Case-Diagram" src="https://github.com/user-attachments/assets/4cc9d91c-b531-4fb2-8676-e94dddfc1f71" />

## Entity Relationship Diagram


## Requirements Traceability Matrix

|Req. ID| Requirement             | System Feature | Test  |
| FR-01 | User can log in         | Login Page     | TC-01 |
| FR-02 | User can create request | Request Form   | TC-02 |
| FR-03 | User can view requests  | Request Table  | TC-03 |
| FR-04 | User can update request | Edit Function  | TC-04 |
| FR-05 | User can delete request | Delete Function| TC-05 |
| FR-06 | User can search         | Search Function| TC-06 |
| FR-07 | User can filter         | Filter Function| TC-07 |
| FR-08 |System displays summaries| Dashboard      | TC-08 |

## Functional Testing

| Test ID | Test Scenario | Expected Result | Result |
| TC-01 | Login using valid account | Dashboard appears | PASS |
| TC-02 | Submit valid request | Request saved | PASS |
| TC-03 | Display requests | Existing records appear | PASS |
| TC-04 | Modify request | Changes saved | PASS |
| TC-05 | Delete request | Confirmation appears and record is removed | PASS |
| TC-06 | Search requester | Matching records displayed | PASS |
| TC-07 | Filter Pending requests | Only Pending records are displayed | PASS |
| TC-08 | Open deployed URL | Application loads online | PASS |
