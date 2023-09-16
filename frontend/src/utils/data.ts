const draft = [
  {
    id: '1',
    projectCode: 'PR-01',
    priority: 'Medium',
    name: 'Request for 3D Printer',
    dateStart: new Date('2021-09-10'),
    dateEnd: new Date('2021-11-10'),
    noOfComments: 2,
    status: 'Draft',
    requester: 'Thu Nguyen',
  },
  {
    id: '2',
    projectCode: 'PR-02',
    priority: 'High',
    name: 'Request for 3D Printer',
    dateStart: new Date('2021-09-10'),
    dateEnd: new Date('2021-11-10'),
    noOfComments: 2,
    status: 'Draft',
    requester: 'Thu Nguyen',
  },
  {
    id: '4',
    projectCode: 'PR-02',
    priority: 'High',
    name: 'Request for 3D Printer',
    dateStart: new Date('2021-09-10'),
    dateEnd: new Date('2021-11-10'),
    noOfComments: 2,
    status: 'Draft',
    requester: 'Thu Nguyen',
  },
  {
    id: '5',
    projectCode: 'PR-02',
    priority: 'High',
    name: 'Request for 3D Printer',
    dateStart: new Date('2021-09-10'),
    dateEnd: new Date('2021-11-10'),
    noOfComments: 2,
    status: 'Draft',
    requester: 'Thu Nguyen',
  },
  {
    id: '6',
    projectCode: 'PR-02',
    priority: 'High',
    name: 'Request for 3D Printer',
    dateStart: new Date('2021-09-10'),
    dateEnd: new Date('2021-11-10'),
    noOfComments: 2,
    status: 'Draft',
    requester: 'Thu Nguyen',
  },
];

const ready = [
  {
    id: '3',
    projectCode: 'PR-03',
    priority: 'Low',
    name: 'Request for 3D Printer',
    dateStart: new Date('2021-09-10'),
    dateEnd: new Date('2021-11-10'),
    noOfComments: 2,
    status: 'Ready',
    requester: 'Thu Nguyen',
  },
];

const PurchaseRequisitionColumns = {
  draft: {
    title: 'Draft',
    items: draft,
  },
  ready: {
    title: 'Ready',
    items: ready,
  },
  waitingToApproval: {
    title: 'Waiting to Approval',
    items: [],
  },
  todo: {
    title: 'To-do',
    items: [],
  },
  inProgress: {
    title: 'In Progress',
    items: [],
  },
  complete: {
    title: 'Complete',
    items: [],
  },
  onHold: {
    title: 'On Hold',
    items: [],
  },
  cancelled: {
    title: 'Cancelled',
    items: [],
  },
};

export default PurchaseRequisitionColumns;
