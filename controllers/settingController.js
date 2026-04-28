const Setting = require('../models/Setting')
const sendResponse = require('../utils/responseHandler')

const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne()

    if (!settings) {
      settings = await Setting.create({
        agencyName: 'Diamond Milk Agency',
        currency: 'INR',
        language: 'English',
        primaryColor: '#06b6d4',
        backgroundColor: '#020617',
        textColor: '#ffffff',
        cardColor: '#0f172a',
      })
    }

    return sendResponse(res, 200, true, 'Settings fetched successfully', settings)
  } catch (error) {
    next(error)
  }
}

const saveSettings = async (req, res, next) => {
  try {
    const {
      agencyName,
      phone,
      email,
      gstNumber,
      address,
      fullCreamRate,
      tonedMilkRate,
      cowMilkRate,
      buffaloMilkRate,
      currency,
      language,
      primaryColor,
      backgroundColor,
      textColor,
      cardColor,
    } = req.body

    let settings = await Setting.findOne()

    if (!settings) {
      settings = new Setting()
    }

    settings.agencyName = agencyName ?? settings.agencyName
    settings.phone = phone ?? settings.phone
    settings.email = email ?? settings.email
    settings.gstNumber = gstNumber ?? settings.gstNumber
    settings.address = address ?? settings.address

    settings.fullCreamRate = Number(fullCreamRate ?? settings.fullCreamRate ?? 0)
    settings.tonedMilkRate = Number(tonedMilkRate ?? settings.tonedMilkRate ?? 0)
    settings.cowMilkRate = Number(cowMilkRate ?? settings.cowMilkRate ?? 0)
    settings.buffaloMilkRate = Number(buffaloMilkRate ?? settings.buffaloMilkRate ?? 0)

    settings.currency = currency ?? settings.currency
    settings.language = language ?? settings.language

    settings.primaryColor = primaryColor ?? settings.primaryColor
    settings.backgroundColor = backgroundColor ?? settings.backgroundColor
    settings.textColor = textColor ?? settings.textColor
    settings.cardColor = cardColor ?? settings.cardColor

    const updatedSettings = await settings.save()

    return sendResponse(res, 200, true, 'Settings saved successfully', updatedSettings)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getSettings,
  saveSettings,
}