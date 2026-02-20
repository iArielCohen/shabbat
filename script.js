let participants = [];

// מילון תרגום קטגוריות לעברית לתצוגה ברשימה המאוחדת
const shiftNames = {
    'full': 'שבת מלאה',
    'fri': 'שישי בלבד',
    'sat': 'שבת בלבד'
};

function addPerson(category, weight) {
    const nameInput = document.getElementById(`name-${category}`);
    const paidInput = document.getElementById(`paid-${category}`);
    
    const name = nameInput.value.trim();
    const paid = parseFloat(paidInput.value) || 0; 

    if (!name) {
        alert("נא להזין את שם הכבאי לפני ההוספה.");
        return;
    }

    if (paid < 0) {
        alert("סכום התשלום לא יכול להיות שלילי.");
        return;
    }

    const newParticipant = {
        id: Date.now(), 
        name: name,
        paid: paid,
        weight: weight,
        category: category
    };

    participants.push(newParticipant);
    
    nameInput.value = '';
    paidInput.value = '';

    renderLists();
}

function removePerson(id) {
    participants = participants.filter(p => p.id !== id);
    renderLists();
}

function editPerson(id) {
    const person = participants.find(p => p.id === id);
    if (!person) return;

    const nameInput = document.getElementById(`name-${person.category}`);
    const paidInput = document.getElementById(`paid-${person.category}`);
    
    nameInput.value = person.name;
    paidInput.value = person.paid > 0 ? person.paid : '';

    removePerson(id);
    nameInput.focus();
}

// מעודכן: מרנדר רשימה אחת מרכזית במקום 3 נפרדות
function renderLists() {
    const mainContainer = document.getElementById('unified-list-container');
    const listContainer = document.getElementById('all-participants-list');
    
    // אם אין משתתפים, נסתיר את אזור הרשימה לגמרי
    if (participants.length === 0) {
        mainContainer.style.display = 'none';
        listContainer.innerHTML = '';
        return;
    }

    // הצגת הקונטיינר אם יש לפחות משתתף אחד
    mainContainer.style.display = 'block';
    
    let listHTML = '';
    
    participants.forEach(p => {
        const shiftLabel = shiftNames[p.category];
        
        listHTML += `
            <div class="person-item">
                <div class="person-info">
                    <strong>${p.name}</strong>
                    <span class="badge-shift">${shiftLabel}</span>
                    <span class="person-paid">(שילם: ₪${p.paid.toFixed(2)})</span>
                </div>
                <div class="person-actions">
                    <button class="action-btn edit-btn" title="ערוך משתתף" onclick="editPerson(${p.id})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="action-btn delete-btn" title="מחק משתתף" onclick="removePerson(${p.id})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            </div>`;
    });

    listContainer.innerHTML = listHTML;
}

function calculateSplit() {
    if (participants.length === 0) {
        alert("הרשימה ריקה. הוסף כבאים כדי לבצע חישוב.");
        return;
    }

    const totalCost = participants.reduce((sum, p) => sum + p.paid, 0);
    const totalWeights = participants.reduce((sum, p) => sum + p.weight, 0);
    
    if (totalWeights === 0 || totalCost === 0) {
        alert("לא הוזנו סכומים לתשלום. ודא שלפחות כבאי אחד שילם על הקניות.");
        return;
    }

    const costPerWeightUnit = totalCost / totalWeights;

    let debtors = [];   
    let creditors = []; 

    participants.forEach(p => {
        const fairShare = p.weight * costPerWeightUnit; 
        const balance = p.paid - fairShare;             

        if (balance < -0.01) {
            debtors.push({ name: p.name, amount: Math.abs(balance) });
        } else if (balance > 0.01) {
            creditors.push({ name: p.name, amount: balance });
        }
    });

    const resultsContainer = document.getElementById('results');
    
    let resultsHTML = `
        <h2 style="color: var(--success-color); margin-bottom: 1.5rem;">סיכום התחשבנות תחנתי</h2>
        <div class="summary-stats">
            <div class="stat-box">
                <h4>סה"כ הוצאות שבת</h4>
                <div class="amount">₪${totalCost.toFixed(2)}</div>
            </div>
            <div class="stat-box">
                <h4>עלות ליום בודד</h4>
                <div class="amount">₪${costPerWeightUnit.toFixed(2)}</div>
            </div>
            <div class="stat-box">
                <h4>עלות לסופ"ש מלא</h4>
                <div class="amount">₪${(costPerWeightUnit * 2).toFixed(2)}</div>
            </div>
        </div>
        <h3 style="margin-bottom: 1rem;">העברות כספים לביצוע (ביט / פייבוקס / מזומן):</h3>
        <ul class="transactions-list">
    `;

    if (debtors.length === 0 && creditors.length === 0) {
        resultsHTML += `
            <li class="transaction-item" style="justify-content: center; color: var(--success-color); font-weight: bold;">
                כולם שילמו בדיוק את החלק שלהם. אין צורך בהעברות! 🙌
            </li>`;
    }

    let i = 0; 
    let j = 0; 
    
    while (i < debtors.length && j < creditors.length) {
        let currentDebtor = debtors[i];
        let currentCreditor = creditors[j];
        
        let amountToTransfer = Math.min(currentDebtor.amount, currentCreditor.amount);

        resultsHTML += `
            <li class="transaction-item">
                <strong>${currentDebtor.name}</strong> 
                <span style="margin: 0 10px;">מעביר/ה</span>
                <span class="transfer-icon">&larr;</span> 
                <strong>${currentCreditor.name}</strong> 
                <span style="margin-right: auto; font-weight: bold; color: var(--primary-color);">₪${amountToTransfer.toFixed(2)}</span>
            </li>`;

        currentDebtor.amount -= amountToTransfer;
        currentCreditor.amount -= amountToTransfer;

        if (currentDebtor.amount < 0.01) i++;
        if (currentCreditor.amount < 0.01) j++;
    }
    
    resultsHTML += `</ul>`;
    
    resultsContainer.innerHTML = resultsHTML;
    resultsContainer.style.display = 'block';
    
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}
