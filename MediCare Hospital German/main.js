document.addEventListener('DOMContentLoaded', function() {
    // Doctor data by department
    const doctorsByDepartment = {
        cardiology: [
            { id: 'dr-smith', name: 'Dr. John Smith' },
            { id: 'dr-patel', name: 'Dr. Anita Patel' }
        ],
        neurology: [
            { id: 'dr-johnson', name: 'Dr. Sarah Johnson' },
            { id: 'dr-martinez', name: 'Dr. Rafael Martinez' }
        ],
        orthopedics: [
            { id: 'dr-chen', name: 'Dr. Michael Chen' },
            { id: 'dr-wilson', name: 'Dr. Thomas Wilson' }
        ],
        pediatrics: [
            { id: 'dr-rodriguez', name: 'Dr. Emily Rodriguez' },
            { id: 'dr-kim', name: 'Dr. David Kim' }
        ],
        general: [
            { id: 'dr-davis', name: 'Dr. Jessica Davis' },
            { id: 'dr-taylor', name: 'Dr. Robert Taylor' }
        ]
    };

    // Selectors
    const departmentSelect = document.getElementById('department');
    const doctorSelect = document.getElementById('doctor');
    const appointmentForm = document.getElementById('appointmentForm');
    const appointmentDate = document.getElementById('appointment-date');
    
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    appointmentDate.min = tomorrow.toISOString().split('T')[0];
    
    // Set maximum date to 3 months from now
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    appointmentDate.max = maxDate.toISOString().split('T')[0];
    
    // Update doctors dropdown based on department selection
    departmentSelect.addEventListener('change', function() {
        const department = this.value;
        const doctors = doctorsByDepartment[department] || [];
        
        // Clear current options
        doctorSelect.innerHTML = '<option value="" disabled selected>Arzt auswählen</option>';
        
        // Add new options
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = doctor.name;
            doctorSelect.appendChild(option);
        });
        
        // Enable doctor select if there are options
        doctorSelect.disabled = doctors.length === 0;
    });
    
    // Form validation
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset all error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
        let isValid = true;
        
        // Validate full name (at least first and last name)
        const patientName = document.getElementById('patient-name').value.trim();
        if (!patientName || patientName.split(' ').length < 2) {
            document.getElementById('name-error').textContent = 'Bitte geben Sie Ihren vollständigen Namen ein (Vor- und Nachname)';
            isValid = false;
        }
        
        // Validate email
        const email = document.getElementById('patient-email').value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('email-error').textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
            isValid = false;
        }
        
        // Validate phone number (basic validation)
        const phone = document.getElementById('patient-phone').value.trim();
        if (!phone || phone.length < 10) {
            document.getElementById('phone-error').textContent = 'Bitte geben Sie eine gültige Telefonnummer ein';
            isValid = false;
        }
        
        // Validate date
        const date = document.getElementById('appointment-date').value;
        if (!date) {
            document.getElementById('date-error').textContent = 'Bitte wählen Sie ein gewünschtes Datum aus';
            isValid = false;
        }
        
        // Validate time
        const time = document.getElementById('appointment-time').value;
        if (!time) {
            document.getElementById('time-error').textContent = 'Bitte wählen Sie eine gewünschte Uhrzeit aus';
            isValid = false;
        }
        
        // Validate department
        const department = document.getElementById('department').value;
        if (!department) {
            document.getElementById('department-error').textContent = 'Bitte wählen Sie eine Abteilung aus';
            isValid = false;
        }
        
        // Validate doctor
        const doctor = document.getElementById('doctor').value;
        if (!doctor && department) {
            document.getElementById('doctor-error').textContent = 'Bitte wählen Sie einen bevorzugten Arzt aus';
            isValid = false;
        }
        
        // Validate symptoms
        const symptoms = document.getElementById('symptoms').value.trim();
        if (!symptoms || symptoms.length < 10) {
            document.getElementById('symptoms-error').textContent = 'Bitte beschreiben Sie Ihre Symptome (mindestens 10 Zeichen)';
            isValid = false;
        }
        
        // Validate terms agreement
        const termsAgreement = document.getElementById('terms-agreement').checked;
        if (!termsAgreement) {
            document.getElementById('terms-error').textContent = 'Sie müssen den Allgemeinen Geschäftsbedingungen zustimmen';
            isValid = false;
        }
        
        // If form is valid, submit it
        if (isValid) {
            // Collect form data
            const formData = {
                name: patientName,
                email: email,
                phone: phone,
                date: date,
                time: time,
                department: departmentSelect.options[departmentSelect.selectedIndex].text,
                doctor: doctorSelect.options[doctorSelect.selectedIndex].text,
                insurance: document.getElementById('insurance').value.trim(),
                symptoms: symptoms
            };
            
            console.log('Termin Anfrage:', formData);
            
            // Show success message
            showAppointmentConfirmation(formData);
            
            // Reset form
            appointmentForm.reset();
        }
    });
    
    // Function to show appointment confirmation
    function showAppointmentConfirmation(data) {
        // Create formatted date and time for display
        const appointmentDate = new Date(data.date + 'T' + data.time);
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        
        const formattedDate = appointmentDate.toLocaleDateString('de-DE', dateOptions);
        const formattedTime = appointmentDate.toLocaleTimeString('de-DE', timeOptions);
        
        // Create modal content
        const modalTitle = 'Termin Vereinbart!';
        const modalContent = `
            <div class="appointment-confirmation">
                <p>Vielen Dank, dass Sie einen Termin bei uns vereinbart haben, <strong>${data.name}</strong>.</p>
                <div class="confirmation-details">
                    <p><strong>Abteilung:</strong> ${data.department}</p>
                    <p><strong>Arzt:</strong> ${data.doctor}</p>
                    <p><strong>Datum:</strong> ${formattedDate}</p>
                    <p><strong>Uhrzeit:</strong> ${formattedTime}</p>
                </div>
                <p>Wir haben eine Bestätigungs-E-Mail an <strong>${data.email}</strong> mit Ihren Termindetails gesendet.</p>
                <p>Sollten Sie den Termin verschieben oder absagen müssen, kontaktieren Sie uns bitte mindestens 24 Stunden vor Ihrem Termin.</p>
            </div>
        `;
        
        // Create and show modal
        const modal = document.createElement('div');
        modal.classList.add('modal-overlay');
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal">
                <span class="close-button">&times;</span>
                <h2>${modalTitle}</h2>
                ${modalContent}
                <button class="close-modal">Schließen</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners to close the modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Send confirmation email (simulated)
        console.log(`Bestätigungs-E-Mail wird an ${data.email} gesendet für den Termin am ${formattedDate} um ${formattedTime}`);
    }
});