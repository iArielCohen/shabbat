let fullParticipants = [];
let fridayParticipants = [];
let saturdayParticipants = [];

document.getElementById('fullParticipantsForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('fullParticipantName').value;
  const amount = parseFloat(document.getElementById('fullParticipantAmount').value);

  fullParticipants.push({ name, amount });
  updateParticipantsList();
  clearForm('full');
});

document.getElementById('fridayParticipantsForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('fridayParticipantName').value;
  const amount = parseFloat(document.getElementById('fridayParticipantAmount').value);

  fridayParticipants.push({ name, amount });
  updateParticipantsList();
  clearForm('friday');
});

document.getElementById('saturdayParticipantsForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('saturdayParticipantName').value;
  const amount = parseFloat(document.getElementById('saturdayParticipantAmount').value);

  saturdayParticipants.push({ name, amount });
  updateParticipantsList();
  clearForm('saturday');
});

function updateParticipantsList() {
  const fullList = document.getElementById('fullParticipantsList');
  const fridayList = document.getElementById('fridayParticipantsList');
  const saturdayList = document.getElementById('saturdayParticipantsList');

  fullList.innerHTML = '';
  fridayList.innerHTML = '';
  saturdayList.innerHTML = '';

  fullParticipants.forEach((participant, index) => {
    fullList.innerHTML += `
      <p>${participant.name} - ${participant.amount} ש"ח
        <button class="edit" onclick="editParticipant('full', ${index})">ערוך</button>
        <button class="delete" onclick="deleteParticipant('full', ${index})">מחק</button>
      </p>
    `;
  });

  fridayParticipants.forEach((participant, index) => {
    fridayList.innerHTML += `
      <p>${participant.name} - ${participant.amount} ש"ח
        <button class="edit" onclick="editParticipant('friday', ${index})">ערוך</button>
        <button class="delete" onclick="deleteParticipant('friday', ${index})">מחק</button>
      </p>
    `;
  });

  saturdayParticipants.forEach((participant, index) => {
    saturdayList.innerHTML += `
      <p>${participant.name} - ${participant.amount} ש"ח
        <button class="edit" onclick="editParticipant('saturday', ${index})">ערוך</button>
        <button class="delete" onclick="deleteParticipant('saturday', ${index})">מחק</button>
      </p>
    `;
  });
}

function deleteParticipant(type, index) {
  if (type === 'full') {
    fullParticipants.splice(index, 1);
  } else if (type === 'friday') {
    fridayParticipants.splice(index, 1);
  } else if (type === 'saturday') {
    saturdayParticipants.splice(index, 1);
  }
  updateParticipantsList();
}

function editParticipant(type, index) {
  const name = prompt('הזן שם חדש:', type === 'full' ? fullParticipants[index].name : type === 'friday' ? fridayParticipants[index].name : saturdayParticipants[index].name);
  const amount = prompt('הזן סכום חדש:', type === 'full' ? fullParticipants[index].amount : type === 'friday' ? fridayParticipants[index].amount : saturdayParticipants[index].amount);
  
  if (name && amount) {
    const newAmount = parseFloat(amount);
    if (type === 'full') {
      fullParticipants[index] = { name, amount: newAmount };
    } else if (type === 'friday') {
      fridayParticipants[index] = { name, amount: newAmount };
    } else if (type === 'saturday') {
      saturdayParticipants[index] = { name, amount: newAmount };
    }
    updateParticipantsList();
  }
}

function clearForm(type) {
  if (type === 'full') {
    document.getElementById('fullParticipantName').value = '';
    document.getElementById('fullParticipantAmount').value = '';
  } else if (type === 'friday') {
    document.getElementById('fridayParticipantName').value = '';
    document.getElementById('fridayParticipantAmount').value = '';
  } else {
    document.getElementById('saturdayParticipantName').value = '';
    document.getElementById('saturdayParticipantAmount').value = '';
  }
}

function calculatePayment() {
  const totalFullAmount = fullParticipants.reduce((sum, participant) => sum + participant.amount, 0);
  const totalFridayAmount = fridayParticipants.reduce((sum, participant) => sum + participant.amount, 0);
  const totalSaturdayAmount = saturdayParticipants.reduce((sum, participant) => sum + participant.amount, 0);

  const totalAmount = totalFullAmount + totalFridayAmount + totalSaturdayAmount;

  const fullCount = fullParticipants.length;
  const fridayCount = fridayParticipants.length;
  const saturdayCount = saturdayParticipants.length;

  const totalPeople = fullCount + fridayCount + saturdayCount;
  const eachPersonShouldPay = totalAmount / totalPeople;

  let resultsHtml = `
    <p>העלות הכוללת: ${totalAmount} ש"ח</p>
    <p>תשלום לשבת מלאה: ${eachPersonShouldPay.toFixed(2)} ש"ח</p>
  `;

  fullParticipants.forEach(participant => {
    const balance = participant.amount - eachPersonShouldPay;
    resultsHtml += `<p>${participant.name} שילם ${participant.amount} ש"ח, צריך ${balance >= 0 ? 'לקבל' : 'לשלם'} ${Math.abs(balance).toFixed(2)} ש"ח</p>`;
  });

  fridayParticipants.forEach(participant => {
    const balance = participant.amount - (eachPersonShouldPay / 2);
    resultsHtml += `<p>${participant.name} שילם ${participant.amount} ש"ח, צריך ${balance >= 0 ? 'לקבל' : 'לשלם'} ${Math.abs(balance).toFixed(2)} ש"ח</p>`;
  });

  saturdayParticipants.forEach(participant => {
    const balance = participant.amount - (eachPersonShouldPay / 2);
    resultsHtml += `<p>${participant.name} שילם ${participant.amount} ש"ח, צריך ${balance >= 0 ? 'לקבל' : 'לשלם'} ${Math.abs(balance).toFixed(2)} ש"ח</p>`;
  });

  document.getElementById('results').innerHTML = resultsHtml;
}
