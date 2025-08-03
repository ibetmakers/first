const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

console.log('🔍 Тестирование подключения к MongoDB...');
console.log('📡 URI:', config.env.MONGODB_URI ? 'Настроен' : 'НЕ НАЙДЕН');

// Тест DNS
const dns = require('dns').promises;

async function testDNS() {
    try {
        console.log('🌐 Тестирование DNS...');
        const addresses = await dns.resolve4('cluster0.nwcpxml.mongodb.net');
        console.log('✅ DNS разрешен:', addresses);
        return true;
    } catch (error) {
        console.log('❌ DNS ошибка:', error.message);
        return false;
    }
}

async function testMongoDB() {
    try {
        console.log('🔌 Попытка подключения к MongoDB...');
        
        const connection = await mongoose.connect(config.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 15000,
            connectTimeoutMS: 10000,
        });
        
        console.log('✅ Подключение к MongoDB успешно!');
        console.log('📊 Статус подключения:', connection.connection.readyState);
        
        // Тест простого запроса
        const collections = await connection.connection.db.listCollections().toArray();
        console.log('📚 Доступные коллекции:', collections.map(c => c.name));
        
        await mongoose.disconnect();
        console.log('🔌 Отключение завершено');
        
    } catch (error) {
        console.error('❌ Ошибка подключения к MongoDB:');
        console.error('   Код:', error.code);
        console.error('   Сообщение:', error.message);
        console.error('   Имя:', error.name);
        
        if (error.code === 'ETIMEOUT') {
            console.error('\n💡 Рекомендации для решения ETIMEOUT:');
            console.error('   1. Используйте VPN');
            console.error('   2. Измените DNS на 8.8.8.8 и 8.8.4.4');
            console.error('   3. Проверьте файрвол');
            console.error('   4. Попробуйте другой интернет-провайдер');
        }
    }
}

async function main() {
    await testDNS();
    console.log('\n' + '='.repeat(50) + '\n');
    await testMongoDB();
}

main(); 