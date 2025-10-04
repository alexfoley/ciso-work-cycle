# Licensing Guide - CISO Work Cycle

This document explains the CISO Work Cycle licensing in plain language for developers, enterprises, and evaluators.

## Quick Summary

**License**: GNU Affero General Public License v3.0 (AGPL-3.0-or-later)

**What this means:**
- ✅ Free to use, modify, and distribute
- ✅ Source code transparency required
- ✅ Network use requires sharing modifications
- ⚠️ SaaS/web services must provide source code to users

## Understanding AGPL-3.0

### What is AGPL?

The GNU Affero General Public License (AGPL) is an open source license designed for software accessed over a network. It's similar to the GPL but **includes network copyleft** protection against "SaaS washing."

### Network Copyleft Explained

**Traditional GPL**: If you distribute modified software as a download, you must share source code.

**AGPL Network Copyleft**: If you run modified software as a web service, you must provide source code to your users.

This prevents companies from using open source software in proprietary SaaS offerings without contributing back.

## What You Can Do

### ✅ Permitted Uses

- **Use internally** within your organization (no distribution required)
- **Modify** the code to fit your needs
- **Deploy** on your internal network or intranet
- **Study** how the software works
- **Distribute** copies to others (must include source)
- **Run** as a web service (must provide source to users)

### ⚠️ Requirements

- **Provide source code** when distributing or offering as network service
- **Include license notice** in all copies
- **Document changes** you make to the code
- **License derivatives** under AGPL-3.0
- **Preserve copyright** notices and attributions

### ❌ Restrictions

- Cannot sublicense under different terms
- Cannot remove AGPL requirements from derivatives
- Cannot use as proprietary SaaS without compliance
- Cannot claim warranty (software provided "as-is")

## Common Use Cases

### Internal Enterprise Use

**Scenario**: Deploy CISO Work Cycle on your internal network for security team use.

**Compliance**: ✅ **No source code sharing required** - Internal use is not distribution.

**Requirements**:
- Retain license notices in the software
- No additional obligations unless you modify and redistribute

---

### Modifying for Internal Use

**Scenario**: Customize CISO Work Cycle for your organization's specific needs.

**Compliance**: ✅ **No source code sharing required** - Internal modifications are private.

**Best Practice**:
- Document your changes for maintenance
- Consider contributing improvements back (optional)
- Track modifications for future upgrades

---

### Offering as SaaS/Web Service

**Scenario**: Run CISO Work Cycle as a web service for external users (customers, partners, clients).

**Compliance**: ⚠️ **Source code must be provided to service users**

**Requirements**:
1. Provide source code download link in your web interface
2. Include all modifications you've made
3. License your modifications under AGPL-3.0
4. Include installation instructions
5. Preserve original copyright notices

**How to comply**:
- Add "Download Source Code" link in your web UI
- Host modified source on GitHub/GitLab
- Document installation and deployment

---

### Distributing Modified Versions

**Scenario**: Share your customized version with others.

**Compliance**: ⚠️ **Must provide source code with distribution**

**Requirements**:
- Include complete source code
- License under AGPL-3.0-or-later
- Document your modifications
- Include build/installation instructions
- Preserve copyright and license notices

---

### Creating Derivative Works

**Scenario**: Build a new product based on CISO Work Cycle.

**Compliance**: ⚠️ **Derivative must be AGPL-3.0 licensed**

**Requirements**:
- Entire derivative work must use AGPL-3.0
- Cannot combine with proprietary code in single program
- Must provide source code to all users
- Can charge for services, not for license exemption

## Compliance Checklist

### For Developers

- [ ] Retain license headers in source files
- [ ] Include LICENSE file in distributions
- [ ] Document modifications in CHANGELOG or commit messages
- [ ] License modifications under AGPL-3.0-or-later
- [ ] Preserve copyright notices

### For Enterprises Evaluating AGPL

- [ ] Determine if use is internal or external
- [ ] Assess if you'll modify the software
- [ ] Decide if offering as web service to external users
- [ ] Review legal requirements with counsel if needed
- [ ] Consider commercial licensing if AGPL doesn't fit

### For SaaS Providers

- [ ] Implement source code download feature in UI
- [ ] Host modified source code publicly
- [ ] Include installation instructions
- [ ] Document all modifications
- [ ] Update source code when deploying changes
- [ ] Preserve all copyright and license notices

## FAQ

### Q: Can I use this commercially?

**A:** Yes! AGPL allows commercial use. You can charge for services, support, hosting, or training. You cannot charge for removing the AGPL requirements.

### Q: Must I share my internal modifications?

**A:** No, if you only use the software internally within your organization and don't distribute it or offer it as a web service to external users.

### Q: What if I offer this as a SaaS to customers?

**A:** You must provide the source code (including your modifications) to your service users. Add a "Download Source" link in your web interface.

### Q: Can I combine this with proprietary code?

**A:** Not in the same program. AGPL derivatives must be entirely AGPL. You can interact via APIs or separate processes, but not link proprietary code into the same binary.

### Q: What about third-party libraries?

**A:** Third-party dependencies must be compatible with AGPL-3.0. This project uses permissively licensed libraries (MIT, Apache-2.0) which are compatible.

### Q: Do I need to share customer data?

**A:** No! AGPL requires sharing **source code**, not data. Your users' data remains private.

### Q: Can I remove the AGPL license?

**A:** No. You cannot relicense AGPL code under different terms unless you own all the copyright or have permission from all copyright holders.

### Q: What if AGPL doesn't work for my business?

**A:** Contact us about commercial licensing options. See [Commercial Licensing](#commercial-licensing) below.

## Commercial Licensing

While AGPL-3.0 works for many use cases, some businesses prefer commercial licenses that don't require source code disclosure.

**When you might need commercial licensing:**
- Building proprietary SaaS without source sharing
- Combining with proprietary code in same program
- Enterprise policies prohibit AGPL adoption
- Prefer traditional software licensing terms

**Commercial licensing includes:**
- Exemption from AGPL source code requirements
- Ability to create proprietary derivatives
- Enterprise support and SLA options
- Professional services and customization

**Contact**: For commercial licensing inquiries, please contact:
- Email: licensing@forna.do
- Subject: "CISO Work Cycle Commercial Licensing Inquiry"

Include:
- Your use case and deployment model
- Organization size and industry
- Timeline for evaluation and deployment

## License Violations

If you believe someone is violating the AGPL license terms:

1. **Document the violation** - Gather evidence of non-compliance
2. **Contact the violator** - Most violations are unintentional
3. **Report to project** - Email: legal@forna.do
4. **Legal escalation** - For serious violations, consult legal counsel

## Full Legal Text

This document provides guidance only. The legally binding terms are in the [LICENSE](LICENSE) file.

**Official AGPL-3.0 License**: [https://www.gnu.org/licenses/agpl-3.0.html](https://www.gnu.org/licenses/agpl-3.0.html)

## Additional Resources

- **AGPL FAQ**: [https://www.gnu.org/licenses/gpl-faq.html](https://www.gnu.org/licenses/gpl-faq.html)
- **FSF AGPL Guide**: [https://www.fsf.org/licensing/licenses/agpl-3.0.html](https://www.fsf.org/licensing/licenses/agpl-3.0.html)
- **SPDX AGPL-3.0**: [https://spdx.org/licenses/AGPL-3.0-or-later.html](https://spdx.org/licenses/AGPL-3.0-or-later.html)

## Questions?

- **General licensing questions**: licensing@forna.do
- **Security issues**: See [SECURITY.md](SECURITY.md)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)
- **Technical questions**: Open an issue on [GitHub](https://github.com/alexfoley/ciso-work-cycle/issues)

---

**Disclaimer**: This document provides general guidance and does not constitute legal advice. Consult with legal counsel for your specific situation.

*Last Updated: October 2025*
