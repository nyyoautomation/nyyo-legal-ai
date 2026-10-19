/* Synthetic, fictional legal corpus written for this demo by Nyyo Automation.
   All companies, places and statutes are invented. No real firm, person or copyrighted doctrine. */
window.LEGAL_CORPUS = [
{ id:"msa", title:"Master Services Agreement", short:"MSA", type:"Contract", file:"contracts/msa-aldermoor-brightfield.pdf",
  parties:"Aldermoor Systems Ltd (Supplier) · Brightfield Retail Group (Client)", sections:[
  {ref:"§1", h:"Parties and purpose", t:"This Master Services Agreement is made between Aldermoor Systems Ltd (the Supplier) and Brightfield Retail Group (the Client). The Supplier provides data analytics and hosting services described in each Statement of Work."},
  {ref:"§3.1", h:"Term and renewal", t:"This Agreement starts on the Effective Date and runs for an initial term of 24 months. It renews automatically for successive 12-month periods unless either party gives written notice of non-renewal at least 90 days before the end of the current term."},
  {ref:"§5.2", h:"Fees and payment", t:"The Client pays each invoice within 30 days of the invoice date. Late payments bear interest at 1.5% per month from the due date until payment in full. The Supplier may suspend the Services if an undisputed invoice remains unpaid 45 days after the due date."},
  {ref:"§8.1", h:"Limitation of liability", t:"Each party's total liability under this Agreement is capped at the total fees paid by the Client in the 12 months before the event giving rise to the claim. The cap does not apply to gross negligence, wilful misconduct, breach of confidentiality or the Client's payment obligations. Neither party is liable for indirect or consequential loss, including lost profits."},
  {ref:"§9.1", h:"Termination for convenience", t:"Either party may terminate this Agreement for convenience by giving 60 days' written notice to the other party. Fees for Services performed up to the termination date remain payable."},
  {ref:"§9.2", h:"Termination for cause", t:"Either party may terminate this Agreement immediately by written notice if the other party commits a material breach and fails to cure it within 30 days of receiving a written notice describing the breach."},
  {ref:"§11.3", h:"Data protection", t:"The Supplier acts as processor of Client personal data under the Data Processing Annex (Annex 2). The Supplier notifies the Client of any personal data breach without undue delay and in any case within 72 hours of becoming aware of it. The Supplier may only appoint sub-processors listed in Annex 2 or approved in writing by the Client."},
  {ref:"§14.2", h:"Notices", t:"Notices under this Agreement must be in writing and sent by registered mail or by email to legal@brightfield.example (Client) or legal@aldermoor.example (Supplier). A notice sent by email is effective on the next business day."},
  {ref:"§15", h:"Governing law", t:"This Agreement is governed by the laws of the State of Westmark. The courts of Westmark City have exclusive jurisdiction over any dispute arising from this Agreement."}
]},
{ id:"nda-a", title:"Mutual NDA (NDA A)", short:"NDA A", type:"Contract", file:"contracts/nda-a-aldermoor-kestrel.pdf",
  parties:"Aldermoor Systems Ltd · Kestrel Robotics Inc", sections:[
  {ref:"§1", h:"Purpose", t:"Aldermoor Systems Ltd and Kestrel Robotics Inc wish to exchange confidential information to evaluate a joint warehouse automation project. This NDA A is mutual: each party may disclose and receive confidential information."},
  {ref:"§4", h:"Duration of confidentiality", t:"The confidentiality obligations under NDA A last for 5 years from the date of each disclosure. Trade secrets remain confidential for as long as they qualify as trade secrets under applicable law."},
  {ref:"§5", h:"Exclusions", t:"Confidential information does not include information that is public through no fault of the receiving party, was already known to it, is independently developed, or is lawfully received from a third party without restriction."},
  {ref:"§6", h:"Return or destruction", t:"On written request, the receiving party returns or destroys all confidential information within 15 days and confirms destruction in writing."},
  {ref:"§7", h:"Non-solicitation", t:"During the evaluation and for 12 months after it ends, neither party solicits for employment any employee of the other party who was directly involved in the project. NDA A contains no non-compete obligation."}
]},
{ id:"nda-b", title:"One-way NDA (NDA B)", short:"NDA B", type:"Contract", file:"contracts/nda-b-brightfield-halcyon.pdf",
  parties:"Brightfield Retail Group (Discloser) · Halcyon Media Studio (Recipient)", sections:[
  {ref:"§1", h:"Purpose", t:"Brightfield Retail Group discloses confidential marketing plans to Halcyon Media Studio for a campaign proposal. NDA B is one-way: only Halcyon Media Studio receives confidential information."},
  {ref:"§3", h:"Duration of confidentiality", t:"The confidentiality obligations under NDA B last for 2 years from the signature date, whatever the date of disclosure."},
  {ref:"§4", h:"Permitted use", t:"Halcyon Media Studio uses the confidential information only to prepare the campaign proposal and shares it only with staff who need to know it and are bound by equivalent confidentiality duties."},
  {ref:"§6", h:"Remedies", t:"The Recipient agrees that a breach may cause irreparable harm and that the Discloser may seek injunctive relief in addition to damages. A contractual penalty of 25,000 applies to each proven unauthorised disclosure."}
]},
{ id:"lease", title:"Commercial Office Lease", short:"Lease", type:"Contract", file:"contracts/lease-harbour-point-unit-4b.pdf",
  parties:"Orchard Estates Ltd (Landlord) · Aldermoor Systems Ltd (Tenant)", sections:[
  {ref:"§2", h:"Premises and term", t:"The Landlord leases Unit 4B, Harbour Point Business Park, to the Tenant for a term of 6 years starting on 1 March 2025, for use as offices."},
  {ref:"§4.1", h:"Rent", t:"The rent is 4,200 per month, payable in advance on or before the 5th day of each month. Late rent unpaid 5 days after the due date bears interest at 8% per year until paid."},
  {ref:"§4.3", h:"Rent review", t:"The rent is reviewed each year on the anniversary of the start date in line with the commercial rent index, with any annual increase capped at 3%."},
  {ref:"§5", h:"Security deposit", t:"The Tenant pays a security deposit equal to 3 months' rent. The Landlord returns the deposit within 2 months after the Tenant leaves, minus any amounts properly owed."},
  {ref:"§7", h:"Repairs", t:"The Tenant keeps the interior of the premises in good repair. The Landlord is responsible for the roof, structure, facade and shared building systems."},
  {ref:"§9", h:"Tenant break option", t:"The Tenant may end the lease at the end of the third year (28 February 2028) by giving the Landlord at least 6 months' prior written notice, provided the rent is fully paid on the break date."}
]},
{ id:"employment", title:"Employment Contract — Senior Data Engineer", short:"Employment", type:"Contract", file:"hr/employment-senior-data-engineer.pdf",
  parties:"Aldermoor Systems Ltd (Employer) · the Employee (anonymised)", sections:[
  {ref:"§2", h:"Probation", t:"The first 3 months of employment are a probation period. During probation either party may end the contract with 2 weeks' notice."},
  {ref:"§6", h:"Working time and remote work", t:"Working time is 38 hours per week. The Employee may work remotely up to 3 days per week, subject to team needs and the remote work policy."},
  {ref:"§7", h:"Annual leave", t:"The Employee is entitled to 25 working days of paid annual leave per calendar year, plus public holidays."},
  {ref:"§10", h:"Notice period", t:"After probation, either party may terminate the employment by giving 2 months' written notice, ending on the last day of a calendar month."},
  {ref:"§12", h:"Non-compete", t:"For 6 months after the employment ends, the Employee will not work for a direct competitor of the Employer within the Westmark region. During this period the Employer pays a monthly compensation equal to 50% of the Employee's last gross monthly salary. The Employer may waive the non-compete in writing at the latest on the last working day."},
  {ref:"§13", h:"Intellectual property", t:"All work product, code and inventions created by the Employee in the course of employment belong to the Employer."}
]},
{ id:"playbook", title:"Internal memo — Contract review playbook", short:"Playbook", type:"Internal memo", file:"memos/contract-review-playbook.docx",
  parties:"Legal team · internal", sections:[
  {ref:"P1", h:"Liability caps", t:"Our playbook position on liability caps: accept a cap of at least 12 months of fees paid. Never accept a cap below 6 months of fees. Reject unlimited liability for the client except for gross negligence, wilful misconduct and data breaches caused by us."},
  {ref:"P2", h:"Auto-renewal", t:"Flag every automatic renewal clause. Diarise the non-renewal notice deadline the day the contract is signed, and push back on notice periods longer than 90 days."},
  {ref:"P3", h:"Governing law", t:"Preferred governing law is the State of Westmark. A foreign governing law needs partner approval and a note on enforcement costs."},
  {ref:"P4", h:"Indemnities", t:"Reject uncapped indemnities. Indemnities for third-party IP claims are acceptable if capped and conditioned on prompt notice and control of the defence."}
]},
{ id:"dpa-memo", title:"Internal memo — Data processing checklist", short:"DPA checklist", type:"Internal memo", file:"memos/data-processing-checklist.docx",
  parties:"Compliance · internal", sections:[
  {ref:"D1", h:"Mandatory DPA terms", t:"Every data processing agreement must include: the list of sub-processors, breach notification within 72 hours, audit rights for the controller, security measures, and deletion or return of personal data at the end of the contract."},
  {ref:"D2", h:"Retention", t:"Client personal data is kept only as long as the contract requires. Backups are deleted within 90 days after the end of the contract."},
  {ref:"D3", h:"Transfers", t:"Personal data stays in the office or in the agreed region. Any transfer outside the agreed region requires prior written approval and a transfer assessment."}
]},
{ id:"act-commercial", title:"Model Commercial Obligations Act (excerpt)", short:"Commercial Act", type:"Statute excerpt (fictional model law)", file:"law/model-commercial-obligations-act.txt",
  parties:"Generic statute text written for this demo", sections:[
  {ref:"Art. 21", h:"Late payment interest", t:"Unless the contract sets a higher rate, late payment between businesses bears statutory interest at the reference rate plus 8 percentage points per year, plus a fixed recovery fee of 40 per invoice."},
  {ref:"Art. 34", h:"Termination of indefinite contracts", t:"A party ending a contract of indefinite duration must give reasonable notice. Notice of less than 30 days is presumed unreasonable for a commercial relationship lasting more than one year."},
  {ref:"Art. 52", h:"Limitation period", t:"Claims arising from a commercial contract are time-barred 5 years after the claimant knew or should have known the facts giving rise to the claim."}
]},
{ id:"act-employment", title:"Model Employment Standards Act (excerpt)", short:"Employment Act", type:"Statute excerpt (fictional model law)", file:"law/model-employment-standards-act.txt",
  parties:"Generic statute text written for this demo", sections:[
  {ref:"Sec. 18", h:"Non-compete clauses", t:"A non-compete clause is valid only if it is in writing, limited in time to no more than 12 months, limited to a defined geographic area, protects a legitimate business interest, and provides financial compensation of at least 30% of the employee's salary for its whole duration."},
  {ref:"Sec. 22", h:"Minimum notice", t:"After probation, the minimum notice period is 1 month for employees with less than 5 years of service, and 2 months beyond 5 years of service. A contract may provide longer notice."}
]}
];

/* Sample uploaded document for Analyze mode (fictional, deliberately risky) */
window.SAMPLE_UPLOAD = {name:"supplier-agreement-sample.txt", text:
`SUPPLY AGREEMENT (sample, fictional)
Between Vantor Components Ltd (the Supplier) and the Buyer.

1. Term. This Agreement has an initial term of 3 years and renews automatically for successive 3-year periods unless the Buyer gives notice of non-renewal at least 180 days before the end of the current term.

2. Exclusivity. The Buyer shall purchase all of its components of this type exclusively from the Supplier during the term.

3. Prices. The Supplier may change its prices at any time by giving 15 days' notice. The Buyer may not refuse a price change.

4. Payment. Invoices are payable within 15 days. Late payment bears interest at 2% per month.

5. Liability. The Buyer's liability under this Agreement is unlimited. The Supplier's liability is capped at 1,000 per year.

6. Indemnity. The Buyer shall indemnify the Supplier against all claims, losses and costs of any kind, without limit.

7. Termination. The Supplier may terminate this Agreement at any time with 10 days' notice. The Buyer may terminate only for material breach not cured within 90 days.

8. Confidentiality. Each party keeps the other's confidential information secret for 2 years.

9. Assignment. The Supplier may assign this Agreement to any third party without the Buyer's consent.

10. Data. The Supplier may process Buyer personal data and transfer it to any country.
`};
