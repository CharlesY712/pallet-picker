exports.seed = function(knex, Promise) {
  return knex('pallets').del() 
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        
        knex('projects').insert({
          name: 'Fooo',
        }, 'id')
          .then(pallets => {
            return knex('pallets').insert([
              { name: 'First Pallet',
                color1: '#FF99CC',
                color2: '#000000',
                color3: '#0099FF',
                color4: '#996633',
                color5: '#CC3366'
              },
              { name: 'Second Pallet',
                color1: '#FF99CC',
                color2: '#000000',
                color3: '#0099FF',
                color4: '#996633',
                color5: '#CC3366'
              }
            ])
          })
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};