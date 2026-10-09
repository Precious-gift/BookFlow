# BookFlow User Flows

## Flow 1 — Public visitor to owner onboarding

1. Visitor opens public landing page.
2. Visitor chooses Get Started or Sign In.
3. Get Started leads to business owner registration.
4. Registration validates input and creates the owner account.
5. Owner signs in and enters the authenticated `/portal`.
6. Protected owner screens remain inaccessible without valid authorization.

**Not in scope:** social login, SSO, MFA setup, customer accounts.

## Flow 2 — Customer guest booking

1. Customer opens the business public booking URL `/b/[slug]`.
2. Select an active service and review its duration and informational price.
3. Select a valid date and available time slot.
4. Enter Full Name (required), Phone Number (required), and Email (optional).
5. Review the appointment summary.
6. Submit the booking request.
7. Display a read-only request-received confirmation with reference code, summary, and Pending status.
8. Explain that the request is awaiting confirmation by the business owner.

**Rules:** No customer account, login, password, customer portal, self-cancellation, self-rescheduling, calendar export, or payment workflow. Validate slot availability at submission and prevent double booking.

## Flow 3 — Owner appointment management

1. Owner authenticates and enters `/portal`.
2. Owner opens Appointments or the dashboard agenda.
3. Owner reviews Pending requests.
4. Owner confirms, reschedules, or cancels according to the permitted business workflow.
5. Owner records completion after the service has been rendered.
6. UI shows the updated status with both text and distinct icon.

**Statuses:** Pending → Confirmed → Completed; Pending or Confirmed may be Cancelled according to business rules. Completed means the service was rendered, not that payment was settled.

## Flow 4 — Owner manages services and availability

1. Owner opens Services and creates/edits a service.
2. Owner defines service name, description, duration, informational price, and active state.
3. Owner opens Availability and configures weekly working hours or blocked periods.
4. Public booking offers only active services and valid available slots.

## Flow 5 — Owner manages customers

1. A customer record is created/populated through bookings.
2. Owner opens the CRM directory.
3. Owner views customer details and appointment history.
4. Owner may add private internal notes.
5. Do not add customer segmentation or external messaging features.

## Flow 6 — Owner profile and account

1. Owner opens Business Profile & Settings.
2. Owner reviews/edits business identity fields and logo.
3. Owner copies the public booking URL or opens the public preview.
4. Owner opens Account & Security to update password or log out.
5. Protected operations require owner authentication.

## Flow 7 — Platform administration

1. Administrator signs into the separate `/admin` portal.
2. Administrator views platform-level aggregate KPIs and recent activity.
3. Administrator searches/filters registered businesses.
4. Administrator opens business details to inspect owner/profile information and basic usage.
5. Administrator reviews basic platform usage metrics.
6. Admin does not operate an owner's business, create bookings as a customer, or perform financial BI.

## Flow 8 — Responsive navigation

- Desktop owner/admin: persistent sidebar and top bar.
- Tablet: collapsible sidebar/rail or drawer.
- Mobile: top bar and slide-over drawer.
- Public landing page: public navigation remains clear; mobile navigation must not introduce authenticated controls.
- Touch targets on tablet/mobile are at least 44px.

## Foundation ambiguity to resolve

The foundation's §4 describes five named stages including Review; §11 calls the flow a four-step stepper while omitting Review from its diagram. The required user journey includes Review and a final request-received state. Confirm the desired stepper count before changing its visual representation.
