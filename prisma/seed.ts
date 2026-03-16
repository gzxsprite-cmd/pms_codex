import { PrismaClient, TaskStatus, TimelineStatus } from '@prisma/client';

const prisma = new PrismaClient();

const defaultRoles = [
  'Project Manager','Sales','Engineering','Purchasing','Quality','Logistics','Finance','Other'
];

async function main() {
  await prisma.projectTask.deleteMany();
  await prisma.projectMilestone.deleteMany();
  await prisma.projectTeamMember.deleteMany();
  await prisma.project.deleteMany();

  for (let i = 1; i <= 3; i++) {
    const project = await prisma.project.create({
      data: {
        projectId: `P-2026-00${i}`,
        name: `Demo Program ${i}`,
        customer: i === 1 ? 'Tesla' : i === 2 ? 'BYD' : 'BMW',
        productPlatform: i === 1 ? 'EV Charger' : i === 2 ? 'Battery Pack' : 'Infotainment',
        plantRegion: i === 1 ? 'CN-SH' : 'DE-MU',
        phase: ['RFQ', 'Development', 'SOP'][i - 1],
        status: ['Open', 'On Track', 'Risk'][i - 1],
        priority: i === 3 ? 'High' : 'Medium',
        sopDate: new Date(2026, i + 2, 15),
        startDate: new Date(2026, i, 1),
        endDate: new Date(2026, i + 5, 30),
        projectManager: `PM ${i}`,
        salesOwner: `Sales ${i}`,
        comment: 'Seeded demo project'
      }
    });

    await prisma.projectTeamMember.createMany({
      data: defaultRoles.map((role, idx) => ({
        projectRef: project.id,
        roleName: role,
        personName: `${role} User ${i}`,
        email: `${role.toLowerCase().replace(/\s+/g, '.')}@demo.local`,
        department: role,
        companyFunction: 'Demo BU',
        sortOrder: idx
      }))
    });

    const m1 = await prisma.projectMilestone.create({ data: {
      projectRef: project.id,
      milestoneCode: `MS-${i}-01`,
      milestoneName: 'Kickoff',
      baselineDate: new Date(2026, i, 5),
      actualDate: new Date(2026, i, 6),
      status: TimelineStatus.DONE,
      sortOrder: 1
    }});
    const m2 = await prisma.projectMilestone.create({ data: {
      projectRef: project.id,
      milestoneCode: `MS-${i}-02`,
      milestoneName: 'PV Build',
      baselineDate: new Date(2026, i + 2, 10),
      status: TimelineStatus.ON_TRACK,
      sortOrder: 2
    }});

    await prisma.projectTask.createMany({
      data: [
        {
          projectRef: project.id,
          taskCode: `TSK-${i}-001`,
          taskName: 'Define scope',
          owner: 'PM',
          status: TaskStatus.DONE,
          startDate: new Date(2026, i, 2),
          dueDate: new Date(2026, i, 8),
          progress: 100,
          relatedMilestoneId: m1.id,
          sortOrder: 1
        },
        {
          projectRef: project.id,
          taskCode: `TSK-${i}-002`,
          parentTaskId: `TSK-${i}-001`,
          taskName: 'Validate resources',
          owner: 'Engineering',
          status: TaskStatus.IN_PROGRESS,
          startDate: new Date(2026, i, 9),
          dueDate: new Date(2026, i + 1, 5),
          progress: 45,
          relatedMilestoneId: m2.id,
          sortOrder: 2
        }
      ]
    });
  }
}

main().finally(async () => prisma.$disconnect());
