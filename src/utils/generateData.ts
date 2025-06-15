import { faker } from '@faker-js/faker';

const generateUserData = (count: number) => {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const registeredDate = faker.date.past();
    
    users.push({
      id: i + 1,
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }),
      city: faker.location.city(),
      registeredDate,
    });
  }
  
  return users;
};

export default generateUserData;