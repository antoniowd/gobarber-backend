## GoBarber Backend

### Forgot password

**Functional Requirements (FR)**

- Users must be able to retrieve his password by informing his email.
- Users must receive an email with instructions to retrieve their password.
- Users must be able to reset their passwords.

**Not Functional Requirements (NFR)**

- Use Mailtrap to test emails in the development environment.
- Use Amazon SES to send emails in the production environment.
- Email must be sent in the background (background job).

**Business Rules (BR)**

- The link sent by email to reset the password must expire in 2 hours.
- Users must confirm the new password when resetting it.

### Profile update

**FR**

- Users must be able to update their profiles.

**BR**

- Users can't change their email by an existing one.
- Users must inform their password to change for a new one.
- Users must confirm the new password when changing it.

### Provider panel

**FR**

- Users must able to list their appointments on a specific day.
- The provider must receive a notification when an appointment is booked.
- The provider must be able to see unread notifications.

**NFR**

- Daily provider appointments must be cached.
- Provider notifications must be storage on MongoDB.
- Provider notifications must be sent using real-time Socket.io library.

**BR**

- Notifications must have a read and unread status

### Service schedule

**FR**

- Users must be able to see a list of registered providers.
- Users must be able to list a calendar with the days of the month to see at least one provider available schedule.
- Users must be able to filter a provider available schedule, giving a specific day.
- Users must be able to do a new appointment with a provider.

**NFR**

- The provider's list must be cached.


**BR**

- Every appointment must be for one hour.
- The appointments must be available between 8h and 18h.
- Users can't set an appointment if is already booked.
- Users can't set an appointment in the past time.
- The user can't set an appointment with itself.
