# BookFlow Screen Inventory

**Status:** Requirements inventory; not a claim that every listed screen has been exported from Stitch.  
**Visual reference exported in this package:** Public Landing Page — desktop.

| ID | Screen / area | Actor | Required content / purpose | Responsive requirements | Evidence status |
|---|---|---|---|---|---|
| PUB-01 | Public Landing Page | Visitor | Marketing, product value, features, how it works, auth entry points | Desktop/tablet/mobile | Desktop screenshot exported |
| AUTH-01 | Business Owner Registration | Owner | Account creation and validation | Responsive form | Design reference must be matched from Stitch |
| AUTH-02 | Business Owner Sign In | Owner | Authentication and error feedback | Responsive form | Design reference must be matched from Stitch |
| OWN-01 | Owner Dashboard | Owner | KPIs, today's agenda, quick actions | Adapt KPI grid and agenda | Design reference must be matched from Stitch |
| OWN-02 | Appointments | Owner | Calendar/agenda, appointment status actions | Table/calendar adaptation | Design reference must be matched from Stitch |
| OWN-03 | Services | Owner | Service CRUD, duration, informational price, active toggle | Responsive cards/table | Design reference must be matched from Stitch |
| OWN-04 | Availability / Working Hours | Owner | Weekly hours and blocked periods | Responsive controls | Design reference must be matched from Stitch |
| OWN-05 | Customers / CRM | Owner | Customer directory, details, appointment history, internal notes | Responsive list/details | Design reference must be matched from Stitch |
| OWN-06 | Business Profile Overview | Owner | Profile information, logo, public link summary | Responsive layout | Planned in foundation |
| OWN-07 | Edit Business Profile | Owner | Edit profile fields, validation, save/discard states | Responsive form | Planned in foundation |
| OWN-08 | Public Booking Link / Settings | Owner | Public URL, copy action, preview link | Responsive layout | Planned in foundation |
| OWN-09 | Account & Security | Owner | Email, password change, logout | Responsive form | Planned in foundation |
| CUS-01 | Public Booking — Service Selection | Customer | Active services, durations, prices | Responsive service cards | Design reference must be matched from Stitch |
| CUS-02 | Public Booking — Date & Time | Customer | Calendar and available slots | Mobile adaptation, no overflow | Design reference must be matched from Stitch |
| CUS-03 | Public Booking — Customer Details | Customer | Full Name required, Phone required, Email optional | Single-column form | Design reference must be matched from Stitch |
| CUS-04 | Public Booking — Review | Customer | Appointment summary and edit shortcuts | Responsive summary | Required by foundation |
| CUS-05 | Public Booking — Request Received | Customer | Reference code, summary, Pending status, owner-confirmation wording | Responsive read-only confirmation | Required by foundation |
| ADM-01 | Admin Dashboard | Platform Administrator | Aggregate KPIs and recent platform activity | Responsive KPI grid | Planned in foundation |
| ADM-02 | Businesses Directory | Platform Administrator | Search/filter/list of registered businesses | Table/cards responsive behavior | Planned in foundation |
| ADM-03 | Business Details | Platform Administrator | Business profile, owner information, usage counts | Responsive details | Planned in foundation |
| ADM-04 | Platform Usage | Platform Administrator | Basic platform volume/registration trends | Responsive charts/metrics | Planned in foundation |
| ADM-05 | Admin Account & Security | Platform Administrator | Credentials/session logout | Responsive form | Planned in foundation |

## State inventory

States to implement when relevant:
- Loading, empty, error, and recovery
- Form validation errors and disabled fields
- Saving/submitting and success feedback
- Confirmation dialogs for consequential actions
- Appointment statuses: Pending, Confirmed, Completed, Cancelled
- Responsive navigation open/closed
- Protected-route unauthenticated/unauthorized states

## Export status

Only `exports/public-landing-page-desktop.png` is included as a verified, named screen export in this package. Other source images available in the working session were not automatically assigned to screen names because their identities could not be established with sufficient confidence. Export them from Stitch and map them to this inventory during the next handoff pass.
