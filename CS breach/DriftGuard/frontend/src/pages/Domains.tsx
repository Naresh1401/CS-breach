import { useEffect, useState } from 'react'
import { api } from '../api'
import { LoadingSpinner } from '../components/Shared'
import type { DomainConfig } from '../types'
import { Globe, CheckCircle, Upload } from 'lucide-react'
import clsx from 'clsx'

const DEMO_DOMAINS: DomainConfig[] = [
  { domain_id: 'healthcare', name: 'Healthcare', description: 'HIPAA-aware clinical and administrative signal analysis with Epic EMR integration', signal_types: ['access_log', 'audit_review', 'incident_response', 'training_completion'], compliance_frameworks: ['HIPAA', 'HITECH'], active: true },
  { domain_id: 'finance', name: 'Finance', description: 'SOX/PCI DSS aligned financial services monitoring with trading desk and compliance office focus', signal_types: ['access_log', 'audit_review', 'approval_workflow', 'communication'], compliance_frameworks: ['SOX', 'PCI-DSS', 'GLBA'], active: true },
  { domain_id: 'government', name: 'Government', description: 'FedRAMP/FISMA government and military security monitoring with clearance-aware thresholds', signal_types: ['access_log', 'audit_review', 'incident_response', 'communication'], compliance_frameworks: ['FedRAMP', 'FISMA', 'NIST 800-53'], active: false },
  { domain_id: 'retail', name: 'Retail', description: 'PCI DSS retail and e-commerce security monitoring with seasonal pattern awareness', signal_types: ['access_log', 'audit_review', 'approval_workflow'], compliance_frameworks: ['PCI-DSS'], active: false },
  { domain_id: 'education', name: 'Education', description: 'FERPA-aligned educational institution monitoring with research and student data protection', signal_types: ['access_log', 'audit_review', 'training_completion'], compliance_frameworks: ['FERPA'], active: false },
  { domain_id: 'enterprise', name: 'Enterprise (General)', description: 'General enterprise cybersecurity monitoring applicable to most organizations', signal_types: ['access_log', 'audit_review', 'incident_response', 'communication', 'approval_workflow', 'training_completion'], compliance_frameworks: ['NIST CSF', 'ISO 27001'], active: true },
]

export default function Domains() {
  const [domains, setDomains] = useState<DomainConfig[]>(DEMO_DOMAINS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const data = await api.getDomains()
        if (!cancelled) setDomains(data)
      } catch { /* demo */ }
      finally { if (!cancelled) setLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Domain Configuration</h1>
          <p className="text-sm text-gray-500 mt-1">
            YAML-driven domain adapters — configure signal mappings per vertical
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Upload size={16} /> Upload YAML
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.map((domain) => (
          <div
            key={domain.domain_id}
            className={clsx(
              'card transition-all hover:shadow-md',
              domain.active && 'border-l-4 border-l-green-500'
            )}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-drift-50">
                <Globe size={20} className="text-drift-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{domain.name}</h3>
                {domain.active && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle size={12} /> Active
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{domain.description}</p>

            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Signal Types</p>
                <div className="flex flex-wrap gap-1">
                  {domain.signal_types.map((st) => (
                    <span key={st} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {st.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Compliance</p>
                <div className="flex flex-wrap gap-1">
                  {domain.compliance_frameworks.map((cf) => (
                    <span key={cf} className="text-xs bg-drift-50 text-drift-700 px-2 py-0.5 rounded font-medium">
                      {cf}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
