# Field Inquiry Studio

**Status:** Proposed signature learning layer for all 34 Crop Advisor Foundations modules.  
**Author:** Manus AI  
**Purpose:** Make every source-grounded module more distinctive by converting its existing applied field brief into a repeatable, evidence-to-decision rehearsal.

## Design rationale

The **Field Inquiry Studio** is built around a five-stage routine: **frame, observe, interpret, decide, and recheck or refer**. It gives each learner a guided way to practise the kind of evidence-led professional judgement expected in field advisory work, rather than only reading content or answering a knowledge question. Each module draws its signal, evidence, quality standard, and safety boundary from its existing source-grounded field brief and competency map.

FAO describes Farmer Field Schools as people-centred, participatory learning using direct observation, discussion, decision-making, and field-based experimentation in local ecological and socio-economic contexts.[1] FAO also identifies agroecosystem analysis as a field-school practice involving observation, data collection, analysis, and decision-making.[2] Work-based learning sources describe practical instruction and participation in work activities under guidance as a route toward work-relevant learning objectives.[3] The Studio adapts these principles into an individual, digital rehearsal; it does not represent a Farmer Field School or a replacement for supervised field practice.

| Studio move | Learner work | Course safeguard |
|---|---|---|
| **Frame** | Turn the field signal into a decision-focused question. | Avoid a vague or premature recommendation. |
| **Observe** | Plan direct observations and a meaningful comparison. | Keep local conditions and evidence gaps visible. |
| **Interpret** | Link evidence to the module concept while stating uncertainty. | Do not convert one symptom, number, or image into a certain cause. |
| **Decide** | Set a bounded next action or investigation. | Preserve authorised, label-led, laboratory, extension, or specialist checks where needed. |
| **Recheck or refer** | Define a review point or escalation trigger. | Treat field judgement as reviewable rather than final. |

> **Formal progression boundary:** Field Inquiry Studio is voluntary developmental practice. It does not alter lesson completion, the 80% formal assessment standard, sequential gates, certification, owner alerts, or supervisor competency scoring.

## Module coverage and trusted-source alignment

The shared routine is instantiated for all 34 modules using the existing `moduleFieldBriefs` and `competencyFramework` data. This maintains the course’s uploaded-source alignment while making the learning experience more distinctive: learners rehearse a local field question, evidence route, explanation, bounded decision, and recheck condition for every module.

High-consequence crop-protection modules continue to forbid improvised product, rate, threshold, treatment, medical, cleanup, disposal, legal-reporting, or unverified local-regulatory advice. The Studio repeats the existing module safety boundary and directs learners to current labels, authorised channels, laboratories, extension services, or qualified specialists when those checks are required.

## Paired peer review

Learners may now save a Field Inquiry decision and voluntarily create one revocable private link for one signed-in peer to review it through three structured prompts: evidence seen, question to test, and next evidence to strengthen. This is a developmental conversation rather than a peer grade. The owner controls the link, self-review is blocked, the first completed review closes the pair, and saving revised reasoning automatically revokes an active link. The workflow and privacy boundary are specified in [`Paired-Field-Inquiry-Peer-Review.md`](./Paired-Field-Inquiry-Peer-Review.md).

## References

[1] [Food and Agriculture Organization of the United Nations, *Global Farmer Field School Platform: Overview*](https://www.fao.org/farmer-field-schools/overview/en/).

[2] [Food and Agriculture Organization of the United Nations, *Understanding the Farmer Field School agroecosystem analysis*](https://openknowledge.fao.org/handle/20.500.14283/cb6742en).

[3] [UNESCO-UNEVOC, *TVETipedia: Work-based learning*](https://connect.unevoc.unesco.org/home/TVETipedia+Glossary/lang=en/show=term/term=work-based+learning); [Cedefop, *Work-based learning*](https://www.cedefop.europa.eu/en/publications/2300).
