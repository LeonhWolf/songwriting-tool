# Security

Most of the stored data is not considered sensitive. However, it should be protected from unauthorized updates.

User credentials, email and password, should definitely protected from theft.

The following security measures use the OWASP Top Ten 2021.

**Consequences:**

Run a dependency check, SAST and DAST for every merge into the main branch.

## 1. Broken Access Control

**Description:**

- user can access resources that he is not authorized to
- attackers can then view sensitive data and modify it

**Mitigation:**

- there are no roles in this application
- all user related data will only be available to the authenticated user (sessions)

## 2. Cryptographic Failures

**Description:**

- ineffective execution and configuration of cryptography (e.g. using outdated protocols.)

**Mitigation:**

- communication between client & server: HTTPS (TLS)
- hashing passwords: Argon2id, min. 19 MiB, iteration count 2, 1 degree of parallelism with salt ([Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html))

## 3. Injection

**Description:**

- malicious user input is blindly used by the server
- executing scripts that reveal, modify or delete sensitive data
- mostly related to SQL injection

**Mitigation:**

- MongoDB: [database injection will not be a problem](https://www.mongodb.com/docs/manual/faq/fundamentals/#how-does-mongodb-address-sql-or-query-injection-)
- Redis: [not vulnerable to injections](https://redis.io/docs/manual/security/#string-escaping-and-nosql-injection)

## 4. Injection

**Description:**

- an insecure design fails to have a secure lifecycle

**Mitigation:**

- consider security in the design process (in this document) and at testing
- use tools to identify vulnerabilities before merging into the main branch
  - Static Security Application Testing, for [node.js](https://medium.com/@manjula.aw/nodejs-security-tools-de0d0c937ec0)
  - Dynamic Security Application Testing, [open source tools](https://securityboulevard.com/2019/05/3-opensource-tools-for-dast/)

## 5. Security Misconfiguration

**Description:**

- some human misconfiguration that compromises the security of the system

**Mitigation:**

- changing all default credentials in the system (e.g. for servers)
- Static Application Security Testing (see above)

## 6. Vulnerable and Outdated Components

**Description:**

- especially outdated components can lead to vulnerabilities

**Mitigation:**

- for every merge into the main branch:
  - remove unused dependencies, components, files and documentation
  - verify that all client- and server-side components (frameworks, libraries) are up to date ([OWASP Dependency Check](https://owasp.org/www-project-dependency-check/), or [retire.js](https://github.com/RetireJS/retire.js))

## 7. Identification and Authentication Failures

**Description:**

- improper configuration of authentication and session management
- great risk of exposing access to sensitive data

**Mitigation:**

- preventing brute force by locking authentication for an IP address (on the server!) for 1 min. after 5 successful or failed login attempts
- not providing **any** default credentials to users
- preventing user from picking a [weak password](https://nordpass.com/most-common-passwords-list/)
- check passwords instantly on user input for >= 8 characters
- logging detected brute forces
- preventing enumeration attacks at registration, login, credential recovery by providing only generic messages
  - **registration:** "You should receive a confirmation email shortly. If not, the email address is already taken. Feel free to contact the support in this case."
  - **login:** "Email and/or password are incorrect. Please try again."
  - **credential recovery:** "You should receive an email with instructions to reset your password shortly. If not, an account with this email address does not exist. Feel free to contact the support in this case."
- session ids will be invalidated after logout and deleted after a timeout of 14 days

## 8. Software and Data Integrity Failures

**Description:**

- downloading components or updates from untrusted sources

**Mitigation:**

- only use trusted repositories (mainly measured by their popularity)
- use [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/) for every merge into the main branch

## 9. Security Logging and Monitoring Failures

**Description:**

- breaches cannot be mitigated if they are not logged and monitored
- breaches also need to be responded to

**Mitigation:**

- logging all login failures and server-side input validation failures with user context (to identify malicious accounts)
- logging in an easily consumable format, prevent injections (sanitize inputs), e.g. with [winston](https://github.com/winstonjs/winston)
- alerting responsible people of suspicious behavior
- DAST SHOULD trigger alerts!

## 10. Server-Side Request Forgery

**Description:**

- a server fetches a resource received by a user without validation
- attackers can e.g. access internal services by sending the route "http://localhost:28017/"

**Mitigation:**

- sanitization and validation of input data from the client
- never sending raw responses to clients

# Testability

Testing is a high priority to increase reliability of the app.

Front-End: component tests, UI testing (with [Storybook](https://storybook.js.org/))

Back-End: unit tests

# Monitoring

Hosting services (e.g. digitalocean) have their own server resource monitoring.

# Alerts

## Crashes

Crashes need to be handled quickly.

Docker offers a [functionality](https://stackoverflow.com/questions/56583099/restart-docker-container-on-inner-process-crash) to automatically restart a container if the running processed crashed. This should be used.

Additionally, crashes need to trigger sending an email with metadata (date, stack trace) to a responsible person. This email service obviously needs to be a different service than the one that crashed.

## Security

Detected security risks of high severity need to also lead to an email being sent to the responsible person.

## Performance

It is important to get notified when the servers are running out of resources. So that a growing user base can be handled and does not lead to the app slowing down or even crashing.

For the beginning resource alerts from the hosting service should be enough (e.g. for [digitalocean](https://docs.digitalocean.com/products/monitoring/how-to/set-up-alerts/))
