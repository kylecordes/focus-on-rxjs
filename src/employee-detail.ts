import { html, render } from 'lit-html';

import { Employee } from './employee';

// A lit-html template uses the `html` template tag:
const cardContent = (employee: Employee | undefined) =>
  html`
    <div class="card-content">
      <div class="card-title">${employee?.firstName} ${employee?.lastName}</div>
      <p>Email: <strong>${employee?.email}</strong></p>
      <p>Hours Worked: <strong>${employee?.hoursWorked}</strong></p>
      <p>Hourly Wage: <strong>${employee?.hourly_wage}</strong></p>
    </div>
  `;

export function showEmployee(emp: Employee | undefined, elem: HTMLElement) {
  render(cardContent(emp), elem);
}
