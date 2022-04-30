import './ExemptionOrder.css';

function ExemptionOrder() {
  return (

      <div class="row" id="anchor-exemptions">
        <div class="col-12">
          <h3>Freistellungsaufträge:</h3>
          <div><span class="fw-bold">Gesamtfreistellungsauftrag:</span> <span id="exemptionorder-totalamount"></span></div>
          <div><span class="fw-bold">Bereits verwendet:</span> <span id="exemptionorder-alreadyused"></span></div>
          <div><span class="fw-bold">Noch verfügbar:</span> <span id="exemptionorder-available"></span></div>
                    
          <table id="exemptionordertable" class="table table-striped table-responsive">
            <colgroup>
              <col width="250" />
              <col width="150" />
              <col width="150" />
              <col width="150" />
            </colgroup>
            <thead>
              <tr>
                <th class="text-start">Titel</th>
                <th class="text-end">Freistellung bis</th>
                <th class="text-end">Bereits verwendet</th>
                <th class="text-end">Noch verfügbar</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>

  );
}

export default ExemptionOrder;
