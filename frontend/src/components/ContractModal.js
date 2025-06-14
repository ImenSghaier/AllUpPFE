import React, { useRef, useState } from 'react';
import { 
  FaTimes, FaPrint,  FaShare, FaFileSignature,
  FaBuilding, FaFileAlt, FaCalendarAlt, FaSignature,
  FaCheckCircle, FaRegClock, FaSpinner
} from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './ContractModal.css';

const ContractModal = ({ contract, onClose }) => {
  const contractRef = useRef();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  if (!contract) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifiée";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusIcon = () => {
    switch(contract.statut) {
      case 'ACTIF': return <FaCheckCircle className="status-icon active" />;
      case 'EN_ATTENTE': return <FaRegClock className="status-icon pending" />;
      case 'EXPIRÉ': return <FaTimes className="status-icon expired" />;
      case 'REFUSÉ': return <FaTimes className="status-icon rejected" />;
      default: return <FaFileAlt className="status-icon" />;
    }
  };

  const generateFullPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const element = contractRef.current;
      
      const options = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollY: 0,
        windowHeight: element.scrollHeight
      };

      const canvas = await html2canvas(element, options);
      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`contrat_complet_${contract._id.slice(-6)}.pdf`);
    } catch (error) {
      console.error("Erreur génération PDF:", error);
      alert("Erreur lors de la génération du PDF complet");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const printWindow = window.open('', '_blank');
      const element = contractRef.current;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Contrat </title>
            <meta charset="utf-8">
            <style>
              /* Reset et base */
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body { 
                font-family: 'Arial', sans-serif; 
                line-height: 1.6; 
                color: #333;
                padding: 20px;
                max-width: 1000px;
                margin: 0 auto;
              }
              
              /* En-tête d'impression */
              .print-header { 
                background: #4361ee;
                color: white;
                padding: 25px;
                margin-bottom: 30px;
                border-radius: 4px;
                text-align: center;
              }
              .print-header h2 { 
                font-size: 24px;
                margin-bottom: 10px;
              }
              .print-header p { 
                font-size: 16px;
                opacity: 0.9;
              }
              
              /* Sections du contrat */
              .contract-section { 
                margin-bottom: 30px;
                page-break-inside: avoid;
              }
              .section-title {
                font-size: 18px;
                color: #4361ee;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 2px solid #f0f0f0;
                display: flex;
                align-items: center;
                gap: 10px;
              }
              
              /* Grille d'informations */
              .info-grid { 
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 20px;
              }
              .info-card {
                background: #f9fafb;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #4361ee;
              }
              .info-label {
                font-weight: bold;
                color: #555;
                margin-bottom: 5px;
                font-size: 14px;
              }
              .info-value {
                font-size: 15px;
              }
              
              /* Clause contractuelle */
              .clause-box {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 6px;
                border: 1px solid #eaeaea;
              }
              .clause-content {
                white-space: pre-line;
                line-height: 1.7;
              }
              
              /* Signatures */
              .signatures-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-top: 20px;
              }
              .signature-card {
                padding: 20px;
                border-radius: 6px;
                border: 1px solid #ddd;
                min-height: 150px;
                position: relative;
              }
              .signature-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
              }
              .signature-title {
                font-weight: bold;
              }
              .signature-badge {
                padding: 4px 10px;
                border-radius: 20px;
                font-size: 13px;
                display: inline-flex;
                align-items: center;
                gap: 5px;
              }
              .signed {
                background: #e6f7ee;
                color: #0d8a4a;
              }
              .unsigned {
                background: #fff4e6;
                color: #d46b08;
              }
              .signature-date {
                position: absolute;
                bottom: 15px;
                font-size: 14px;
                color: #666;
              }
              
              /* Conditions */
              .conditions-list {
                list-style: none;
              }
              .condition-item {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
              }
              .condition-bullet {
                width: 8px;
                height: 8px;
                background: #4361ee;
                border-radius: 50%;
                margin-top: 8px;
                flex-shrink: 0;
              }
              
              /* Pied de page */
              .print-footer {
                margin-top: 50px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #777;
                text-align: center;
              }
              
              /* Styles spécifiques à l'impression */
              @page {
                size: A4;
                margin: 15mm;
              }
              @media print {
                body { 
                  padding: 0 !important;
                  font-size: 14px !important;
                }
                .print-header {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                  margin-top: 0;
                }
                .contract-section {
                  margin-bottom: 20px;
                }
                .no-print {
                  display: none !important;
                }
                footer {
                  position: fixed;
                  bottom: 0;
                }
              }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h2>CONTRAT </h2>
              <p>Statut: ${contract.statut} | Créé le: ${formatDate(contract.date_creation)}</p>
            </div>
            
            <div class="contract-print-content">
              <!-- Informations générales -->
              <section class="contract-section">
                <h3 class="section-title">
                  <i class="fas fa-building"></i> INFORMATIONS GÉNÉRALES
                </h3>
                <div class="info-grid">
                  <div class="info-card">
                    <div class="info-label">Fournisseur</div>
                    <div class="info-value">
                      ${contract.id_fournisseur?.nom || "Non spécifié"}
                    </div>
                  </div>
                  
                  <div class="info-card">
                    <div class="info-label">Offre concernée</div>
                    <div class="info-value">
                      ${contract.id_offre?.titre || "Non spécifié"}
                    </div>
                  </div>
                  
                  <div class="info-card">
                    <div class="info-label">Période de validité</div>
                    <div class="info-value">
                      <div>Du ${formatDate(contract.date_debut)}</div>
                      <div>Au ${formatDate(contract.date_fin)}</div>
                    </div>
                  </div>
                </div>
              </section>
              
              <!-- Clause contractuelle -->
              <section class="contract-section">
                <h3 class="section-title">
                  <i class="fas fa-file-alt"></i> CLAUSE CONTRACTUELLE
                </h3>
                <div class="clause-box">
                  <div class="clause-content">
                    ${contract.clause || "Aucune clause spécifiée"}
                  </div>
                </div>
              </section>
              
              <!-- Signatures -->
              <section class="contract-section">
                <h3 class="section-title">
                  <i class="fas fa-signature"></i> SIGNATURES
                </h3>
                <div class="signatures-grid">
                  <div class="signature-card ${contract.signature_entreprise ? 'signed' : 'unsigned'}">
                    <div class="signature-header">
                      <div class="signature-title">VOTRE SIGNATURE</div>
                      <span class="signature-badge ${contract.signature_entreprise ? 'signed' : 'unsigned'}">
                        ${contract.signature_entreprise ? 'SIGNÉ' : 'EN ATTENTE'}
                      </span>
                    </div>
                    ${contract.signature_entreprise ? `
                      <div class="signature-date">
                        Le ${formatDate(contract.date_signature_entreprise)}
                      </div>
                    ` : ''}
                  </div>
                  
                  <div class="signature-card ${contract.signature_fournisseur ? 'signed' : 'unsigned'}">
                    <div class="signature-header">
                      <div class="signature-title">SIGNATURE FOURNISSEUR</div>
                      <span class="signature-badge ${contract.signature_fournisseur ? 'signed' : 'unsigned'}">
                        ${contract.signature_fournisseur ? 'SIGNÉ' : 'EN ATTENTE'}
                      </span>
                    </div>
                    ${contract.signature_fournisseur ? `
                      <div class="signature-date">
                        Le ${formatDate(contract.date_signature_fournisseur)}
                      </div>
                    ` : ''}
                  </div>
                </div>
              </section>
              
              <!-- Conditions particulières -->
              ${contract.conditions ? `
                <section class="contract-section">
                  <h3 class="section-title">CONDITIONS PARTICULIÈRES</h3>
                  <ul class="conditions-list">
                    ${contract.conditions.map(condition => `
                      <li class="condition-item">
                        <div class="condition-bullet"></div>
                        <div class="condition-text">${condition}</div>
                      </li>
                    `).join('')}
                  </ul>
                </section>
              ` : ''}
            </div>
            
            <div class="print-footer">
              <p>Document confidentiel - Propriété exclusive de VotreEntreprise</p>
              <p>© ${new Date().getFullYear()} VotreEntreprise. Tous droits réservés.</p>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } catch (error) {
      console.error("Erreur impression:", error);
      alert("Erreur lors de l'impression");
    } finally {
      setIsPrinting(false);
    }
  };


  const handleShare = async () => {
    try {
      const contractText = `Contrat ${contract.id_offre?.titre || ''}\n` +
        `Statut: ${contract.statut}\n` +
        `Fournisseur: ${contract.id_fournisseur?.nom || "Non spécifié"}\n` +
        `Période: Du ${formatDate(contract.date_debut)} au ${formatDate(contract.date_fin)}`;

      if (navigator.share) {
        await navigator.share({
          title: `Contrat ${contract.id_offre?.titre || ''}`,
          text: contractText
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(contractText);
        alert("Informations copiées dans le presse-papier");
      } else {
        alert(contractText);
      }
    } catch (error) {
      console.error('Erreur partage:', error);
    }
  };

  return (
    <div className="contract-modal-overlay">
      <div className="contract-modal" ref={contractRef}>
        {/* En-tête */}
        <div className="modal-header">
          <div className="header-content">
            <div className="contract-title">
              <FaFileSignature className="title-icon" />
              <div>
                <h2>Contrat </h2>
                <div className="contract-meta">
                  <span className={`contract-status ${contract.statut.toLowerCase()}`}>
                    {getStatusIcon()}
                    {contract.statut}
                  </span>
                  <span className="contract-date">
                    <FaCalendarAlt /> Créé le {formatDate(contract.date_creation)}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="close-button">
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Contenu du contrat */}
        <div className="contract-content">
          <div className="contract-tabs">
            <button className="tab-button active">Détails</button>
            {/* <button className="tab-button">Clauses</button>
            <button className="tab-button">Signatures</button> */}
            {contract.conditions && <button className="tab-button">Conditions</button>}
          </div>

          <div className="tab-content">
            {/* Section Informations */}
            <section className="contract-section">
              <h3 className="section-title">
                <FaBuilding className="section-icon" />
                Informations générales
              </h3>
              <div className="info-grid">
                <div className="info-card">
                  <div className="info-label">Fournisseur</div>
                  <div className="info-value">
                    {contract.id_fournisseur?.nom || "Non spécifié"}
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="info-label">Offre concernée</div>
                  <div className="info-value">
                    {contract.id_offre?.titre || "Non spécifié"}
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="info-label">Période de validité</div>
                  <div className="info-value">
                    <div className="date-range">
                      <span>Du {formatDate(contract.date_debut)}</span>
                      <span>Au {formatDate(contract.date_fin)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section Clause */}
            <section className="contract-section">
              <h3 className="section-title">
                <FaFileAlt className="section-icon" />
                Clause contractuelle
              </h3>
              <div className="clause-box">
                <div className="clause-content">
                  {contract.clause || "Aucune clause spécifiée"}
                </div>
              </div>
            </section>

            {/* Section Signatures */}
            <section className="contract-section">
              <h3 className="section-title">
                <FaSignature className="section-icon" />
                Signatures
              </h3>
              <div className="signatures-grid">
                <div className={`signature-card ${contract.signature_entreprise ? 'signed' : 'unsigned'}`}>
                  <div className="signature-header">
                    <div className="signature-title">Votre signature</div>
                    {contract.signature_entreprise ? (
                      <span className="signature-badge signed">
                        <FaCheckCircle /> Signé
                      </span>
                    ) : (
                      <span className="signature-badge unsigned">
                        En attente
                      </span>
                    )}
                  </div>
                  {/* {contract.signature_entreprise && (
                    <div className="signature-date">
                      Le {formatDate(contract.date_signature_entreprise)}
                    </div>
                  )} */}
                </div>
                
                <div className={`signature-card ${contract.signature_fournisseur ? 'signed' : 'unsigned'}`}>
                  <div className="signature-header">
                    <div className="signature-title">Signature fournisseur</div>
                    {contract.signature_fournisseur ? (
                      <span className="signature-badge signed">
                        <FaCheckCircle /> Signé
                      </span>
                    ) : (
                      <span className="signature-badge unsigned">
                        En attente
                      </span>
                    )}
                  </div>
                  {/* {contract.signature_fournisseur && (
                    <div className="signature-date">
                      Le {formatDate(contract.date_signature_fournisseur)}
                    </div>
                  )} */}
                </div>
              </div>
            </section>

            {/* Section Conditions */}
            {contract.conditions && (
              <section className="contract-section">
                <h3 className="section-title">Conditions particulières</h3>
                <ul className="conditions-list">
                  {contract.conditions.map((condition, index) => (
                    <li key={index} className="condition-item">
                      <div className="condition-bullet"></div>
                      <div className="condition-text">{condition}</div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {/* Pied de page avec actions */}
        <div className="modal-footer">
          <div className="action-buttons">
            <button className="action-button secondary" onClick={handleShare}>
              <FaShare /> Partager
            </button>
            {/* <button 
              className="action-button secondary" 
              onClick={generateFullPDF}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <>
                  <FaSpinner className="spin" /> Génération...
                </>
              ) : (
                <>
                  <FaDownload /> PDF Complet
                </>
              )}
            </button> */}
            <button 
              className="action-button primary" 
              onClick={handlePrint}
              disabled={isPrinting}
            >
              {isPrinting ? (
                <>
                  <FaSpinner className="spin" /> Préparation...
                </>
              ) : (
                <>
                  <FaPrint /> Imprimer
                </>
              )}
            </button>
          </div>
          <div className="legal-footer">
            <p className="confidential">
              Document confidentiel - Propriété exclusive de VotreEntreprise
            </p>
            <p className="copyright">
              © {new Date().getFullYear()} VotreEntreprise. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractModal;
