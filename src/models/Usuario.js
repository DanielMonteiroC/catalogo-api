const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/postgres');

const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomeCompleto: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'nome_completo',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    perfil: {
      type: DataTypes.ENUM('admin', 'comum'),
      defaultValue: 'comum',
    },
  },
  {
    tableName: 'usuarios',
    hooks: {
      beforeCreate: async (usuario) => {
        const salt = await bcrypt.genSalt(12);
        usuario.senha = await bcrypt.hash(usuario.senha, salt);
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('senha')) {
          const salt = await bcrypt.genSalt(12);
          usuario.senha = await bcrypt.hash(usuario.senha, salt);
        }
      },
    },
  }
);

Usuario.prototype.verificarSenha = async function (senhaTexto) {
  return bcrypt.compare(senhaTexto, this.senha);
};

module.exports = Usuario;
